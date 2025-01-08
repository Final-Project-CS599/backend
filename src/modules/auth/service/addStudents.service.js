import dbConfig from "../../../DB/connection.js";
import { errorAsyncHandler } from "../../../utils/error/error.handling.js";
import { emailEvent } from "../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { successResponse } from "../../../utils/response/success.response.js";



const addStudent = errorAsyncHandler(
    async (req ,res ,next) => {
        const {admin_nationalID,firstName  , lastName , middleName, password , confirmPassword ,DOB ,email  , gander ,numberNational , department  , phones} = req.body; 
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'The password and re-password do not match' });
        }
        const morePhones = Array.isArray(phones) ? phones : [phones];

        dbConfig.execute( `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?` , 
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

                dbConfig.execute(`select * from student where s_email =?` ,[email] , (err , data) => {
                    if(err){
                        return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                    }
                    else if(data.length){
                        return res.status(409).json({ message: 'Student email already exists' , email: data[0].s_email  });
                    }
                    else{
                        dbConfig.execute(`select * from student where s_national_id =?` ,[numberNational] , (err , data) => {
                            if(err){
                                return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                            }
                            else if(data.length){
                                return res.status(409).json({ message: 'Student numberNational already exists' ,  numberNational: data[0].s_national_id  });
                            }
                            else{
                                const hashPassword = generateHash({plainText: password});
                                dbConfig.execute(` insert into student (
                                    s_first_name,s_last_name,s_middle_name,s_password,s_DOB,s_email,s_gender,s_national_id,s_admin_id
                                    )
                                    values(?,?,?,?,?,?,?,?,?) ` ,
            
                                    [firstName, lastName, middleName, hashPassword, DOB, email, gander, numberNational, admin_nationalID] , 
                                    async(err , data) => {
                                        if(err || !data.affectedRows === 0){
                                            return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                                        }
        
                                        try {
                                            const studentID = data.insertId;
                                            const encryptedPhones = await Promise.all(
                                                morePhones.map((phone) => {
                                                    const encryptedPhone = generateEncryption({ plainText: phone });
                                                    return new Promise((resolve, reject) => {
                                                        dbConfig.execute(`
                                                            INSERT INTO student_phone(sp_phone, sp_student_id) VALUES (?, ?)`,
                                                            [encryptedPhone, studentID],
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
                                            emailEvent.emit("sendEmail" , {email , password} );
                                            
                
                                            return successResponse({
                                                res , message:"Instructor and phone added successfully" , status: 201 ,
                                                data: {
                                                    admin:{
                                                        nationalID:studentID ,
                                                        fullName: `${firstName} ${lastName} `,
                                                        email,
                                                        numberNational,
                                                        gander,
                                                        DOB
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
                                )
                            }
                        })
                    }
                })
            }
        )
    }
);


export default addStudent;
