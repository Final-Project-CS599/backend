import { errorAsyncHandler } from "../../../../../utils/response/error.response.js";
import { successResponse } from "../../../../../utils/response/success.response.js";
import { generateHash } from "../../../../../utils/hash/hash.js";
import dbConfig from '../../../../../DB/connection.js';
import { emailEvent } from "../../../../../utils/events/sendEmailEvent.js";



const insertDefaultAdmin = errorAsyncHandler( 
    async (req, res, next) => {
        const { nationalID, firstName, lastName,  phone1 , phone2 } = req.body;
        
        const morePhones = {};
        if(phone1){
            morePhones.phone1 = phone1;
        }
        if(phone2){
            morePhones.phone2 = phone2;
        }

        const email = "esraagamal13258@gmail.com";
        dbConfig.execute(
            `SELECT sAdmin_email FROM superAdmin WHERE sAdmin_email = ?`,
            [email],
            (err, results) => {
                if (err) {
                    return next(new Error(`Error Server Database Failed to data check email`, {cause:500}));
                }

                if (results.length > 0) {
                    return next(new Error('Email already exists' , {cause: 400} ));
                }
                dbConfig.execute(
                    `INSERT INTO superAdmin (
                            sAdmin_nationalID, sAdmin_firstName, sAdmin_lastName,sAdmin_email, sAdmin_password, sAdmin_role
                    ) VALUES (?,?,?,?,'12345678910124', 'sAdmin')`,
                    [nationalID, firstName, lastName, email],
                    async (err, data) => {
                        if (err || data.affectedRows === 0) {
                            return next(new Error(`Error Server Database Failed to get data , Failed to execute query`, {cause:500}));
                        }
                        const hashPassword = generateHash({ plainText: "12345678910124" });
                        dbConfig.execute(
                            `UPDATE superAdmin SET sAdmin_password = ? WHERE sAdmin_nationalID = ?`,
                            [hashPassword, nationalID],
                            (err, data) => {
                                if (err || data.affectedRows === 0) {
                                    return next(new Error(`Error Server Database Failed to data default admin password`, {cause:500}));
                                }
                            }
                        );

                        const phoneQueries = Object.entries(morePhones).map(([key , phone]) => {
                            return new Promise((resolve, reject) => {
                                dbConfig.execute(
                                    `INSERT INTO superAdminsPhone(p_number, sAdmin_nationalID) VALUES (?, ?)`,
                                    [phone, nationalID] , 
                                    (err , data) => {
                                        if(err || !data.affectedRows){
                                            reject(err)
                                        }
                                        resolve({ [key]: phone });
                                    }
                                )
                            })
                        })
                        emailEvent.emit("sendEmail" , {email: email })

                        Promise.all(phoneQueries).then((phones)=>{
                            const phonesResult = phones.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                            return successResponse({
                                res, message: "Default admin and phone added successfully", status: 201,
                                data: {
                                    SuperAdmin: {
                                    id: nationalID,
                                    firstName: `${firstName} ${lastName}`,
                                    email,
                                    role: "sAdmin",
                                    },
                                    phone: phonesResult,
                                },
                            })
                        })
                    }
                );
            }
        );
    }
);

export default insertDefaultAdmin;
