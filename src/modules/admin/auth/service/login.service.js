import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';
import { compareHash } from '../../../../utils/hash/hash.js';
import { generateToken } from '../../../../utils/token/token.js';
import { roleTypes } from '../../../../middleware/auth.middleware.js';

const loginUtility = async (
    tableName, emailColumn, passwordColumn, idColumn, roleColumn, updatedAtColumn, firstNameColumn,
    lastNameColumn, middleNameColumn, email, password, departmentColumn, confirmEmailColumn
) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(
            `SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`,
            [email],
            async (err, userData) => {
                if (err) {
                    return reject({ status: 500, message: `Error: Failed to fetch data from database.` });
                }
                if (!userData.length) {
                    return resolve(null);
                }

                const user = userData[0];

                if (user[confirmEmailColumn] !== 1) {
                    return reject({ status: 400, message: "Invalid account. Please confirm your email." });
                }

                const match = compareHash({ plainText: password, hashValue: user[passwordColumn] });
                if (!match) {
                    return reject({ status: 401, message: "Invalid password." });
                }

                dbConfig.execute(`UPDATE ${tableName} SET ${updatedAtColumn} = NOW() WHERE ${emailColumn} = ?`, [email]);

                const userRole = roleColumn ? user[roleColumn] : null;
                let signature = process.env.TOKEN_SIGNATURE;
                if (userRole === roleTypes.Admin || userRole === roleTypes.SuperAdmin) {
                    signature = process.env.TOKEN_SIGNATURE_ADMIN;
                }

                const token = generateToken({
                    payload: { id: user[idColumn], isLoggedIn: true, role: userRole },
                    signature: signature,
                });

                const fullName = middleNameColumn
                    ? `${user[firstNameColumn]} ${user[lastNameColumn]} ${user[middleNameColumn]}`
                    : `${user[firstNameColumn]} ${user[lastNameColumn]}`;

                return resolve({ 
                    token, 
                    id: user[idColumn],
                    fullName,
                    email: user[emailColumn],
                    department: departmentColumn ? user[departmentColumn] : null,
                    role: userRole
                });
            }
        );
    });
};

const login = errorAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const users = [
            {
                table: 'superAdmin',
                emailColumn: 'sAdmin_email',
                passwordColumn: 'sAdmin_password',
                idColumn: 'sAdmin_nationalID',
                roleColumn: 'sAdmin_role',
                updatedAtColumn: 'sAdmin_updatedAt',
                firstNameColumn: 'sAdmin_firstName',
                lastNameColumn: 'sAdmin_lastName',
                middleNameColumn: null,
                departmentColumn: null,
                confirmEmailColumn: 'sAdmin_active',
                roleType: 'SuperAdmin',
                message: "Welcome SuperAdmin to your account (login)"
            },
            {
                table: 'Instructors',
                emailColumn: 'i_email',
                passwordColumn: 'i_password',
                idColumn: 'i_id',
                roleColumn: null,
                updatedAtColumn: 'i_updatedAt',
                firstNameColumn: 'i_firstName',
                lastNameColumn: 'i_lastName',
                middleNameColumn: null,
                departmentColumn: 'i_departmentId',
                confirmEmailColumn: 'i_active',
                roleType: roleTypes.Instructor,
                message: "Welcome Instructor to your account (login)"
            },
            {
                table: 'student',
                emailColumn: 's_email',
                passwordColumn: 's_password',
                idColumn: 's_id',
                roleColumn: null,
                updatedAtColumn: 's_updated_at',
                firstNameColumn: 's_first_name',
                lastNameColumn: 's_last_name',
                middleNameColumn: 's_middle_name',
                departmentColumn: 's_department_id',
                confirmEmailColumn: 's_active',
                roleType: roleTypes.Student,
                message: "Welcome Student to your account (login)"
            }
        ];

        for (const userConfig of users) {
            const result = await loginUtility(
                userConfig.table,
                userConfig.emailColumn,
                userConfig.passwordColumn,
                userConfig.idColumn,
                userConfig.roleColumn,
                userConfig.updatedAtColumn,
                userConfig.firstNameColumn,
                userConfig.lastNameColumn,
                userConfig.middleNameColumn,
                email,
                password,
                userConfig.departmentColumn,
                userConfig.confirmEmailColumn
            );

            if (result) {
                return successResponse({
                    res,
                    message: userConfig.message,
                    status: 200,
                    data: {
                        token: result.token,
                        userId: result.id,
                        fullName: result.fullName,
                        email: result.email,
                        department: result.department,
                        role: userConfig.roleType
                    }
                });
            }
        }

        return next(new Error("User not found", { cause: 404 }));

    } catch (error) {
        if (typeof error === 'object' && error !== null && error.status) {
            return next(new Error(error.message, { cause: error.status }));
        }
        return next(new Error("Internal Server Error", { cause: 500 }));
    }
});

export default login;
