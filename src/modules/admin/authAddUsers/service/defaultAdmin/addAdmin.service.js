import dbConfig from "../../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../../utils/response/error.response.js";
import { successResponse } from "../../../../../utils/response/success.response.js";
import { emailEvent } from "../../../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../../../utils/hash/encryption.js";
import { generateHash } from "../../../../../utils/hash/hash.js";
import { verifyToken } from "../../../../../utils/token/token.js";



const addAdmin = errorAsyncHandler(
    async (req, res, next) => {
        const {adminNationalID ,firstName,lastName ,sAdminNationalID, email, password , confirmPassword, adminRole, phone1 , phone2} = req.body;
    
        if(password !== confirmPassword){
            return res.status(400).json({ message: 'The password and re-password do not match' });
        }

        const morePhones = {};
        if(phone1){
            morePhones.phone1 = phone1;
        }
        if(phone2){
            morePhones.phone2 = phone2;
        }

        dbConfig.execute(` SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? AND sAdmin_role = 'sAdmin' ` , 
            [sAdminNationalID] ,
            (err , dataSuperAdmin)=>{
                if (dataSuperAdmin.length === 0) {
                    // return next(new Error("SuperAdmin not found" , {cause: 404}));
                    return res.status(404).json({ message: 'SuperAdmin not found.' });
                }
                if (dataSuperAdmin[0].sAdmin_role !== 'sAdmin') {
                    return next(new Error("Access denied. Only admins can add superAdmins" , {cause: 403}));
                }
                dbConfig.execute( `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? OR sAdmin_email = ?`, 
                    [adminNationalID, email] , (err, dataAdmin)=>{
                        if (err) {
                            return next(new Error("Error checking superAdmin existence" , {cause: 500}  ));
                        }
                        if (dataAdmin.length > 0){
                            return next(new Error("Admin already exists" , {cause: 409}));
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

                                const phoneQueries = Object.entries(morePhones).map(([key , phone]) => {
                                    return new Promise((resolve, reject) => {
                                        dbConfig.execute(
                                            `INSERT INTO superAdminsPhone(p_number, sAdmin_nationalID) VALUES (?, ?)`,
                                            [phone, adminNationalID] , 
                                            (err , data) => {
                                                if(err || !data.affectedRows){
                                                    reject(err)
                                                }
                                                resolve({ [key]: phone });
                                            }
                                        )
                                    })
                                })
                                emailEvent.emit("sendEmail" , {email , password} );
        
                                Promise.all(phoneQueries).then((phones)=>{
                                    const phonesResult = phones.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                                    return successResponse({
                                        res , message:"Admin added successfully" , status: 201 ,
                                        data: {
                                            admin:{
                                                nationalID:adminNationalID ,
                                                fullName: `${firstName} ${lastName} `,
                                                email,
                                                role: "admin",
                                            },
                                            phone: phonesResult
                                        }
                                    })
                                })
                            }
                        )
                    }
                )
            }
        )
    }
);

export default addAdmin;

