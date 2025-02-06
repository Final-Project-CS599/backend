import dbConfig from "../../../../DB/connection.js";
import { roleTypes } from "../../../../middleware/auth.middleware.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { verifyToken } from "../../../../utils/token/token.js";



const confirmEmail = errorAsyncHandler(
    async (req, res, next) => {
        const {authorization} = req.headers;
        console.log(authorization);
        
        if (!authorization) {
            return next(new Error("Authorization header is missing", { cause: 401 }));
        }

        const {email} =  verifyToken({
            token: authorization, 
            signature: process.env.TOKENSENDEMAIL_SIGNATURE,
            options: {expiresIn: '24h'}
        })

        const queriesTable = [
            { name: "superAdmin", emailColumn: "sAdmin_email", activeColumn: "sAdmin_active", dateColumn: "sAdmin_updatedAt" },
            { name: "Instructors", emailColumn: "i_email", activeColumn: "i_active", dateColumn: "i_updatedAt" },
            { name: "student", emailColumn: "s_email", activeColumn: "s_active", dateColumn: "s_updated_at" }
        ];

        let emailUserFound = false;

        for (const query of queriesTable) {
            try {
                const [data] = await dbConfig.promise().execute(
                    `SELECT * FROM ${query.name} WHERE ${query.emailColumn} = ?`,
                    [email]
                );

                if (data.length > 0) {
                    emailUserFound = true;
                    if (data[0][query.activeColumn] === 1) {
                        return next(new Error("Email Email already confirmed. Please login." , {cause: 400}))
                        // return successResponse({
                        //     res,
                        //     message: "Email already confirmed. Please login.",
                        //     status: 200,
                        // });
                    }
                    await dbConfig.promise().execute(
                        `UPDATE ${query.name} SET ${query.activeColumn} = 1, ${query.dateColumn} = NOW() WHERE ${query.emailColumn} = ?`,
                        [email]
                    );

                    return successResponse({
                        res,
                        message: `${query.name} Email Confirmed Successfully`,
                        status: 200,
                        data: {
                            name: query.name,
                            confirmEmail: 1,
                            updatedAt: new Date().toISOString()
                        }
                    });
                }
            } catch (err) {
                return next(new Error(`Error Server Database Failed to get data`, { cause: 500 }));
            }
        }

        if (!emailUserFound) {
            return next(new Error("Email not found", { cause: 404 }));
        }
    }
);


export default confirmEmail;
