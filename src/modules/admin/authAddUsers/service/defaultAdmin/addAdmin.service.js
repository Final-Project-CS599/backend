import dbConfig from "../../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../../utils/response/error.response.js";
import { successResponse } from "../../../../../utils/response/success.response.js";
import { emailEvent } from "../../../../../utils/events/sendEmailEvent.js";
import { generateHash } from "../../../../../utils/hash/hash.js";
import { verifyToken } from "../../../../../utils/token/token.js";



const addAdmin = errorAsyncHandler(
    async (req, res, next) => {
        const {adminNationalID ,firstName,lastName ,sAdminNationalID, email, password , adminRole, phone1 , phone2} = req.body;

        if (password !== adminNationalID) {
            return res.status(400).json({ message: "Password must be the same as Admin National ID" });
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
                    return res.status(404).json({ message: 'SuperAdmin not found.' });
                }
                if (dataSuperAdmin[0].sAdmin_role !== 'sAdmin') {
                    return next(new Error("Access denied. Only admins can add superAdmins" , {cause: 403}));
                }
                dbConfig.execute( `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? OR sAdmin_email = ?`, 
                    [adminNationalID, email] , 
                    async (err, dataAdmin)=>{
                        if (err) {
                            return next(new Error(`Error Server Database Failed to get data checking superAdmin `, {cause:500}));
                        }
                        if (dataAdmin.length > 0){
                            return next(new Error("Admin already exists" , {cause: 409}));
                        }

                        //Check Email to Table
                        const checkEmailInTable = (tableName, columnName, email) => {
                            return new Promise((resolve, reject) => {
                                dbConfig.execute(`SELECT * FROM ${tableName} WHERE ${columnName} = ?`, [email] ,
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(data.length > 0);
                                        }
                                    }
                                )
                            })
                        }
                        // Check Email In All Tables Already
                        const tablesToCheck = [
                            { tableName: 'student', columnName: 's_email' },
                            { tableName: 'superAdmin', columnName: 'sAdmin_email' },
                            { tableName: 'Instructors', columnName: 'i_email' }
                        ];

                        for (const {tableName ,columnName} of tablesToCheck){
                            const emailExists = await checkEmailInTable(tableName, columnName, email);
                            if (emailExists) {
                                return next(new Error(`Email already exists in ${tableName}`, { cause: 409 }));
                            }
                        }
                        
                        const hashPassword = generateHash({plainText: password});

                        dbConfig.execute(`INSERT INTO superAdmin(
                                sAdmin_nationalID,sAdmin_firstName,sAdmin_lastName,sAdmin_email,sAdmin_password,sAdmin_role
                            )
                            VALUES (?,?,?,?,?,?)`, [adminNationalID,firstName,lastName,email,hashPassword,adminRole],
                            async (err,data)=>{
                                if(err || !data.affectedRows === 0){
                                    return next(new Error(`Error Server Database Failed to get data , execute query `, {cause:500}));
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
                                emailEvent.emit("sendEmail" , {email} );
        
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

