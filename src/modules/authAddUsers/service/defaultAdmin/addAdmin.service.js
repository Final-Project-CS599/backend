import e from "express";
import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/error/error.handling.js";
import { emailEvent } from "../../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../../utils/hash/encryption.js";
import { generateHash } from "../../../../utils/hash/hash.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { verifyToken } from "../../../../utils/token/token.js";


////////////////////////////////////////

export const addAdmin = errorAsyncHandler(
    async (req, res, next) => {
        const {adminNationalID ,firstName,lastName ,sAdminNationalID, email, password , confirmPassword, adminRole, phones } = req.body;
    
        if(password !== confirmPassword){
            return res.status(400).json({ message: 'The password and re-password do not match' });
        }
        
        const morePhones = Array.isArray(phones) ? phones : [phones];

        dbConfig.execute(` SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? AND sAdmin_role = 'sAdmin' ` , 
            [sAdminNationalID] ,
            (err , dataSuperAdmin)=>{
                if (dataSuperAdmin.length === 0) {
                    // return next(new Error("SuperAdmin not found" , {cause: 404}));
                    return res.status(404).json({ message: 'SuperAdmin not found.' });
                }
                if (dataSuperAdmin[0].sAdmin_role !== 'sAdmin') {
                    return next(new Error("Access denied. Only admins can add superAdmins" , {cause: 403}));
                    // return res.status(403).json({ message: 'Access denied. Only admins can add superAdmins.' });
                }
                dbConfig.execute( `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? OR sAdmin_email = ?`, 
                    [adminNationalID, email] , (err, dataAdmin)=>{
                        if (err) {
                            return next(new Error("Error checking superAdmin existence" , {cause: 500}  ));
                            // return res.status(500).json({ message: 'Error checking superAdmin existence', error: err });
                        }
                        if (dataAdmin.length > 0){
                            return next(new Error("Admin already exists" , {cause: 409}));
                            // return res.status(409).json({ message: 'Admin already exists' });
                        }
                        const hashPassword = generateHash({plainText: password});
                        dbConfig.execute(`INSERT INTO superAdmin(
                                sAdmin_nationalID,sAdmin_firstName,sAdmin_lastName,sAdmin_email,sAdmin_password,sAdmin_role
                            )
                            VALUES (?,?,?,?,?,?)`, [adminNationalID,firstName,lastName,email,hashPassword,adminRole],
                            async (err,data)=>{
                                if(err || !data.affectedRows === 0){
                                    return res.status(500).json({ message: 'Failed to get data , Fail to execute query', error: err });
                                }

                                const phoneQueries = morePhones.map((phone) => {
                                    return new Promise((resolve, reject) => {
                                        dbConfig.execute(
                                                `INSERT INTO superAdminsPhone(p_number, sAdmin_nationalID) VALUES (?, ?)`,
                                            [phone , adminNationalID] , 
                                            (err ,data) => {
                                                if(err || !data.affectedRows){
                                                    reject(err)
                                                }
                                                resolve(phone);
                                            }
                                        )
                                    })
                                })
                                emailEvent.emit("sendEmail" , {email , password} );
        
                                Promise.all(phoneQueries).then((phones)=>{
                                    return successResponse({
                                        res , message:"Admin added successfully" , status: 201 ,
                                        data: {
                                            admin:{
                                                nationalID:adminNationalID ,
                                                fullName: `${firstName} ${lastName} `,
                                                email,
                                            },
                                            phone: phones
                                        }
                                    })
                                })

                                // try {
                                //     const encryptedPhones = await Promise.all(
                                //         morePhones.map((phone) => {
                                //             const encryptedPhone = generateEncryption({ plainText: phone });
                                //             return new Promise((resolve, reject) => {
                                //                 dbConfig.execute(
                                //                     `INSERT INTO superAdminsPhone(p_number, sAdmin_nationalID) VALUES (?, ?)`,
                                //                     [encryptedPhone, adminNationalID],
                                //                     (err, data) => {
                                //                         if (err || data.affectedRows === 0) {
                                //                             return reject(err || new Error("Failed to insert phone"));
                                //                         }
                                //                         resolve(encryptedPhone);
                                //                     }
                                //                 );
                                //             });
                                //         })
                                //     );
                                //     emailEvent.emit("sendEmail" , {email , password} );
        
                                //     return successResponse({
                                //         res , message:"Admin added successfully" , status: 201 ,
                                //         data: {
                                //             admin:{
                                //                 nationalID:adminNationalID ,
                                //                 fullName: `${firstName} ${lastName} `,
                                //                 email,
                                //             },
                                //             phone: encryptedPhones
                                //         }
                                //     })
                                // } catch (phoneError) {
                                //     console.error("Phone insert error:", phoneError);
                                //     return res.status(500).json({ message: "Failed to insert phone numbers", error: phoneError });
                                // }
                            }
                        )
                    }
                )
            }
        )
    }
);


export const confirmEmail = errorAsyncHandler(
    async (req , res , next) => {

    }
);

////////////////////////////////////////