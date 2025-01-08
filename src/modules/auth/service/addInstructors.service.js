import dbConfig from "../../../DB/connection.js";
import { errorAsyncHandler } from "../../../utils/error/error.handling.js";
import { emailEvent } from "../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { successResponse } from "../../../utils/response/success.response.js";




const addInstructor = errorAsyncHandler(
    async (req, res ,next) => {
        const {admin_nationalID,firstName , lastName , email , password , confirmPassword ,department ,phones} = req.body;
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'The password and confirmPassword do not match' });
        }
        const morePhones = Array.isArray(phones) ? phones : [phones];
    
        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?` , 
            [admin_nationalID] ,
            (err , adminData) => {
                if (err) {
                    return next(new Error("Error verifying admin/superAdmin role" , {cause: 500}))
                    // return res.status(500).json({ message: 'Error verifying admin/superAdmin role', error: err });
                }
                if (!adminData.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add instructors" , {cause: 403}))
                    // return res.status(403).json({ message: 'Access denied, Only admins or superAdmins can add instructors' });
                }
    
                dbConfig.execute(`select * from Instructors where i_email =?` , [email] ,(err , data) => {
                    if (err) {
                        return next(new Error("Failed to get data , Fail to execute query" , {cause: 500}))
                        // return res.status(500).json({ message: 'Failed to get data , Fail to execute query', error: err });
                    }
                    else if (data.length) {
                        return next(new Error("Instructors email already exists" , {cause: 409}))
                        // return res.status(409).json({ message: 'Instructors email already exists' , email: data[0].email});
                    }
                    else {
                        const hashPassword = generateHash({plainText: password});
                        dbConfig.execute(` insert into Instructors (
                            i_firstName,i_lastName,i_email,i_password,i_adminId
                            ) 
                            values (?,?,?,?,?) ` ,[firstName , lastName , email , hashPassword , admin_nationalID] , 
                            async (err , data) => {
                                if (err || !data.affectedRows === 0) {
                                    return next(new Error("Failed to add data , Fail to execute query" , {cause: 500}))
                                    // return res.status(500).json({ message: 'Failed to add data , Fail to execute query', error: err });
                                }

                                try {
                                    const instructorId = data.insertId;
                                    const encryptedPhones = await Promise.all(
                                        morePhones.map((phone) => {
                                            const encryptedPhone = generateEncryption({ plainText: phone });
                                            return new Promise((resolve, reject) => {
                                                dbConfig.execute(
                                                    `INSERT INTO InstructorsPhone(p_instructorPhone, i_instructorId) VALUES (?, ?)`,
                                                    [encryptedPhone, instructorId],
                                                    (err, data) => {
                                                        if (err || data.affectedRows === 0) {
                                                            return reject(err || new Error("Failed to insert phone"));
                                                        }
                                                        resolve(encryptedPhone);
                                                    }
                                                );
                                            });
                                        })
                                    );
                                    emailEvent.emit("sendEmail" , {email , password});
                                    return successResponse({
                                        res , message:"Instructor and phone added successfully" , status: 201 ,
                                        data: {
                                            admin:{
                                                nationalID:instructorId ,
                                                fullName: `${firstName} ${lastName} `,
                                                email,
                                            },
                                            phone: encryptedPhones
                                        }
                                    })
                                } catch (phoneError) {
                                    console.error("Phone insert error:", phoneError);
                                    return next(new Error("Failed to insert phone numbers" , {cause: 500}))
                                    // return res.status(500).json({ message: "Failed to insert phone numbers", error: phoneError });
                                }
                                
                            }
                        );
                    }
                })
            }
        )
    }
);


export default addInstructor;

