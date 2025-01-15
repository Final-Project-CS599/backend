import { errorAsyncHandler } from "../../../../utils/error/error.handling.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { generateEncryption } from './../../../../utils/hash/encryption.js';
import { generateHash } from "../../../../utils/hash/hash.js";
import dbConfig from './../../../../DB/connection.js';
import { emailEvent } from "../../../../utils/events/sendEmailEvent.js";



const insertDefaultAdmin = errorAsyncHandler( 
    async (req, res, next) => {
        const { nationalID, firstName, lastName, phones } = req.body;
        
        const morePhones = Array.isArray(phones) ? phones : [phones];

        const email = "esraagamal13258@gmail.com";
        dbConfig.execute(
            `SELECT sAdmin_email FROM superAdmin WHERE sAdmin_email = ?`,
            [email],
            (err, results) => {
                if (err) {
                    return next(new Error("Failed to check email" , {cause: 500} , err));
                }

                if (results.length > 0) {
                    return next(new Error('Email already exists' , {cause: 400} ));
                }
                dbConfig.execute(
                    `INSERT INTO superAdmin (
                            sAdmin_nationalID, sAdmin_firstName, sAdmin_lastName,sAdmin_email, sAdmin_password, sAdmin_role
                    ) VALUES (?,?,?,?,'AdminPass123', 'sAdmin')`,
                    [nationalID, firstName, lastName, email],
                    async (err, data) => {
                        if (err || data.affectedRows === 0) {
                            console.error("Insert error:", err);
                            return res.status(500).json({ message: "Failed to execute query", error: err });
                        }
                        const hashPassword = await generateHash({ plainText: "AdminPass123" });
                        dbConfig.execute(
                            `UPDATE superAdmin SET sAdmin_password = ? WHERE sAdmin_nationalID = ?`,
                            [hashPassword, nationalID],
                            (err, data) => {
                                if (err || data.affectedRows === 0) {
                                    return res.status(500).json({ message: "Failed to update default admin password" });
                                }
                            }
                        );

                        const phoneQueries = morePhones.map((phone) => {
                            return new Promise((resolve, reject) => {
                                dbConfig.execute(
                                        `INSERT INTO superAdminsPhone(p_number, sAdmin_nationalID) VALUES (?, ?)`,
                                    [phone , nationalID] , 
                                    (err ,data) => {
                                        if(err || !data.affectedRows){
                                            reject(err)
                                        }
                                        resolve(phone);
                                    }
                                )
                            })
                        })
                        emailEvent.emit("sendEmail" , {email: email , password:'AdminPass123'})

                        Promise.all(phoneQueries).then((phones)=>{
                            return successResponse({
                                res, message: "Default admin and phone added successfully", status: 201,
                                data: {
                                    SuperAdmin: {
                                    id: nationalID,
                                    firstName: `${firstName} ${lastName}`,
                                    email,
                                    role: "sAdmin",
                                    },
                                    phone: phones,
                                },
                            });
                        })

                        // try {

                        //     return successResponse({
                        //             res, message: "Default admin and phone added successfully", status: 201,
                        //             data: {
                        //                 SuperAdmin: {
                        //                 id: nationalID,
                        //                 firstName: `${firstName} ${lastName}`,
                        //                 email,
                        //                 role: "sAdmin",
                        //                 },
                        //                 phone: encryptedPhones,
                        //             },
                        //     });
                        // } catch (phoneError) {
                        //     console.error("Phone insert error:", phoneError);
                        //     return res.status(500).json({ message: "Failed to insert phone numbers", error: phoneError });
                        // }
                    }
                );
            }
        );
    }
);

export default insertDefaultAdmin;