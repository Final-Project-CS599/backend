import { nanoid } from 'nanoid';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';
import { emailEvent } from '../../../../utils/events/sendEmailEvent.js';
import { compareHash, generateHash } from '../../../../utils/hash/hash.js';



// check to columns exist or not exist
const addColumnsIfNotExists = async (tableName) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = ? AND COLUMN_NAME IN ('resetPasswordCode', 'resetPasswordCodeExpiry', 'resetPasswordAttempts')`,
            [tableName],
            async (err, results) => {
                if (err) {
                    return reject({ status: 500, message: `Error Server Database Failed to check columns ` });
                }

                const existingColumns = results.map(row => row.COLUMN_NAME);

                try {
                    if (!existingColumns.includes('resetPasswordCode')) {
                        await dbConfig.execute(`ALTER TABLE ${tableName} ADD COLUMN resetPasswordCode VARCHAR(255)`);
                    }
                    if (!existingColumns.includes('resetPasswordCodeExpiry')) {
                        await dbConfig.execute(`ALTER TABLE ${tableName} ADD COLUMN resetPasswordCodeExpiry DATETIME`);
                    }
                    if (!existingColumns.includes('resetPasswordAttempts')) {
                        await dbConfig.execute(`ALTER TABLE ${tableName} ADD COLUMN resetPasswordAttempts INT DEFAULT 5`);
                    }
                    resolve();
                } catch (err) {
                    return reject({ status: 500, message: `Error SErver Database Failed to adding columns`});
                }
            }
        );
    });
};


// Forget Password
const forgetPasswordUtility = async (tableName, emailColumn, email) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(`SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`, [email],
            async (err, userData) => {
                if (err) {
                    return reject({ status: 500, message: `Error Server Database Failed to get data ` });
                }
                if (!userData.length) {
                    return resolve(null);
                }

                const user = userData[0];

                try {
                    await addColumnsIfNotExists(tableName);
                } catch (err) {
                    return reject(err);
                }

                // Check Code Already Exists
                if (user.resetPasswordCode && user.resetPasswordCodeExpiry) {
                    const now = new Date();
                    const expiryTime = new Date(user.resetPasswordCodeExpiry);

                    if (now < expiryTime) {
                        return reject({ status: 400, message: `A valid code already exists. Please check your email.` });
                    }
                }

                const verificationCode = nanoid(6);
                const hashedCode = await generateHash({ plainText: verificationCode });

                // 10 min expiry
                const expiryTime = new Date();
                expiryTime.setMinutes(expiryTime.getMinutes() + 10);

                const updateQuery = `
                    UPDATE ${tableName}  
                    SET resetPasswordCode = ?, resetPasswordCodeExpiry = ?, resetPasswordAttempts = ?
                    WHERE ${emailColumn} = ?
                `;

                const resetPasswordAttempts = 5; // Reset attempts to 5

                // Check number of attempts (5)
                // if (user.resetPasswordAttempts !== null && user.resetPasswordAttempts <= 0) {
                //     return reject({ status: 400, message: "No more attempts left. Please try again later." });
                // }

                dbConfig.execute(updateQuery, [hashedCode, expiryTime, resetPasswordAttempts, email],
                    (err, data) => {
                        if (err) {
                            return reject({ status: 500, message: `Error Server Database Failed to update data` });
                        }

                        emailEvent.emit('sendCode', { email, code: verificationCode });

                        // Set timeout to delete columns after 10 minutes
                        setTimeout(async () => {
                            try {
                                await dbConfig.execute(`
                                    ALTER TABLE ${tableName}
                                    DROP COLUMN resetPasswordCode,
                                    DROP COLUMN resetPasswordCodeExpiry,
                                    DROP COLUMN resetPasswordAttempts
                                `);
                                console.log(`Columns deleted for ${tableName} after 10 minutes.`);
                            } catch (err) {
                                console.error(`Error deleting columns for ${tableName}:`, err);
                            }
                        }, 10 * 60 * 1000); // 10 minutes

                        return resolve({ status: 200, message: 'Send Code Forgot Password Successfully' });
                    }
                );
            }
        );
    });
};

export const forgotPassword = errorAsyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const tables = [
        { tableName: 'student', emailColumn: 's_email' },
        { tableName: 'superAdmin', emailColumn: 'sAdmin_email' },
        { tableName: 'Instructors', emailColumn: 'i_email' }
    ];

    try {
        let userFound = false;
        for (const { tableName, emailColumn } of tables) {
            const result = await forgetPasswordUtility(tableName, emailColumn, email);

            if (result) {
                userFound = true;
                return successResponse({ res, message: result.message, status: result.status });
            }
        }
        if (!userFound) {
            return next(new Error("Email not found", { cause: 404 }));
        }
    } catch (err) {
        return next(new Error(`Error Server Database Failed to get data `, { cause:500 }));
    }
});


// Verify Code
const verifyCodeUtility = async (tableName, emailColumn, email, code) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(`SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`, [email],
            async (err, userData) => {
                if (err) {
                    return reject({ status: 500, message: `Error Server Database Failed to get data ` });
                }
                if (!userData.length) {
                    return resolve(null);
                }

                const user = userData[0];

                // Check if the code has expired
                const now = new Date();
                const expiryTime = new Date(user.resetPasswordCodeExpiry);

                if (now > expiryTime) {
                    // Delete the columns if the code has expired
                    const deleteColumnsQuery = `
                        ALTER TABLE ${tableName}
                        DROP COLUMN resetPasswordCode,
                        DROP COLUMN resetPasswordCodeExpiry,
                        DROP COLUMN resetPasswordAttempts
                    `;

                    dbConfig.execute(deleteColumnsQuery, (err, data) => {
                        if (err) {
                            return reject({ status: 500, message: `Error Server Database Failed to delete columns ` });
                        }

                        return reject({ status: 400, message: "Code expired. Please request a new code." });
                    });
                } else {
                    const compareHashCode = compareHash({ plainText: code, hashValue: user.resetPasswordCode });
                    if (!compareHashCode) {
                        const updateAttemptsQuery = `
                            UPDATE ${tableName} 
                            SET resetPasswordAttempts = resetPasswordAttempts - 1 
                            WHERE ${emailColumn} = ?
                        `;
                        dbConfig.execute(updateAttemptsQuery, [email],
                            async (err, data) => {
                                if (err) {
                                    return reject({ status: 500, message: `Error Server Database Failed to update attempts `});
                                }

                                // Check number of attempts (5)
                                if (user.resetPasswordAttempts !== null && user.resetPasswordAttempts <= 0) {
                                    // Delete the added columns
                                    const deleteColumnsQuery = `
                                        ALTER TABLE ${tableName}
                                        DROP COLUMN resetPasswordCode,
                                        DROP COLUMN resetPasswordCodeExpiry,
                                        DROP COLUMN resetPasswordAttempts
                                    `;
                                    dbConfig.execute(deleteColumnsQuery, (err, data) => {
                                        if (err) {
                                            return reject({ status: 500, message: `Error Server Database Failed to delete columns ` });
                                        }

                                        if (!data.affectedRows) {
                                            return reject({ status: 400, message: `Failed to delete columns from ${tableName} , please again forget password` });
                                        }

                                        return reject({ status: 400, message: "No more attempts left. Please request a new code." });
                                    });
                                } else {
                                    return reject({ status: 400, message: "Code does not match. Please check your email." });
                                }
                            }
                        );
                    } else {
                        // If the code matches, reset the attempts and proceed
                        const resetAttemptsQuery = `
                            UPDATE ${tableName} 
                            SET resetPasswordAttempts = 5 
                            WHERE ${emailColumn} = ?
                        `;
                        dbConfig.execute(resetAttemptsQuery, [email],
                            (err, data) => {
                                if (err) {
                                    return reject({ status: 500, message: `Error Server Database Failed to reset attempts ` });
                                }

                                return resolve({ status: 200, message: "Code Successfully Matched" });
                            }
                        );
                    }
                }
            }
        );
    });
};

export const verifyCode = errorAsyncHandler(async (req, res, next) => {
    const { email, code } = req.body;

    const tables = [
        { tableName: 'student', emailColumn: 's_email' },
        { tableName: 'superAdmin', emailColumn: 'sAdmin_email' },
        { tableName: 'Instructors', emailColumn: 'i_email' }
    ];

    let userFound = false;
    for (const { tableName, emailColumn } of tables) {
        const result = await verifyCodeUtility(tableName, emailColumn, email, code);

        if (result) {
        userFound = true;
        return successResponse({ res, message: result.message, status: result.status });
        }
    }

    if (!userFound) {
        return next(new Error("Email not found", { cause: 404 }));
    }
});

// Reset Password
export const resetPasswordUtility = async (tableName, emailColumn, passwordColumn, email, newPassword) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(
            `SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`, 
            [email],
            async (err, data) => {
                if (err) {
                    return reject({ status: 500, message: `Error Server Database Failed to get data ` });
                }

                if (!data.length) {
                    return resolve(null);
                }

                const user = data[0];
                const password = user[passwordColumn];

                const isPasswordMatch = compareHash({ plainText: newPassword, hashValue: password });

                if (isPasswordMatch) {
                    return reject({ status: 400, message: `New password match exist password , please password to page login` });
                }

                const hashPassword = generateHash({ plainText: newPassword });

                dbConfig.execute( `UPDATE ${tableName} 
                    SET ${passwordColumn} = ?, resetPasswordCode = NULL, resetPasswordCodeExpiry = NULL , sAdmin_updatedAt = NOW() 
                    WHERE ${emailColumn} = ?`,
                    [hashPassword, email],
                    (err, data) => {
                        if (err || data.affectedRows === 0) {
                            return reject({ status: 500 , message: `Error Server Database Failed to Updata Password` });
                        }
                
                        // Delete resetPasswordCode , resetPasswordCodeExpiry from table DB
                        dbConfig.execute(`ALTER TABLE ${tableName} DROP COLUMN resetPasswordCode, 
                                DROP COLUMN resetPasswordCodeExpiry , DROP COLUMN resetPasswordAttempts
                            `,
                            (err) => {
                                if (err || data.affectedRows === 0) {
                                    return reject({ status: 500 , message: `Error Server Database Failed to delete columns`  });
                                }
                                return resolve({ message: 'Password reset successfully and columns deleted', status: 200 });
                            }
                        );
                    }
                );
            }
        );
    });
};

export const resetPassword = errorAsyncHandler(
    async (req, res, next) => {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return next(new Error('newPassword and confirmPassword do not match', { cause: 400 }));
        }

        const tables = [
            { tableName: 'superAdmin', emailColumn: 'sAdmin_email', passwordColumn: 'sAdmin_password' },
            { tableName: 'student', emailColumn: 's_email', passwordColumn: 's_password' },
            { tableName: 'Instructors', emailColumn: 'i_email', passwordColumn: 'i_password' }
        ];

        for (const table of tables) {
            const result = await resetPasswordUtility(
                table.tableName,
                table.emailColumn,
                table.passwordColumn,
                email,
                newPassword,
            );

            if(result){
                return successResponse({ res, message: "Reset Password Successfully" , status: 200 })
            }
        }
        return next(new Error('Email not found in any table', { cause: 404 }));
    }
);

