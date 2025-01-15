import dbConfig from "../../../DB/connection.js";
import { errorAsyncHandler } from "../../../utils/error/error.handling.js";
import { emailEvent } from "../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { successResponse } from "../../../utils/response/success.response.js";





// const getDepartmentIdByName = async (departmentName) => {
//     try {
//         dbConfig.execute(
//             `SELECT d_id FROM department WHERE d_dept_name = ?`,
//             [departmentName],
//             (err , data) => {
//                 if (err) {
//                     throw err;
//                 }
//                 if (data.length > 0) {
//                     return data[0].d_id;
//                 }
//                 return null;
//             }
//         );
//     } catch (err) {
//         throw err;
//     }
// };

const addStudent = errorAsyncHandler(
    async (req ,res ,next) => {
        const {admin_nationalID,firstName  , lastName , middleName, password , 
            confirmPassword ,DOB ,email  , gander ,numberNational , department  , phones
        } = req.body; 
    
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
                        dbConfig.execute(`select * from student where s_national_id =?` ,[numberNational] ,
                            async (err , data) => {
                                if(err){
                                    return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                                }
                                else if(data.length){
                                    return res.status(409).json({ message: 'Student numberNational already exists' ,  numberNational: data[0].s_national_id  });
                                }
                                else{
                                    const hashPassword = generateHash({plainText: password});

                                    const getDepartmentIdByName = (departmentName) => {
                                        return new Promise((resolve, reject) => {
                                            dbConfig.execute(
                                                `SELECT d_id FROM department WHERE d_dept_name = ?`,
                                                [departmentName],
                                                (err, data) => {
                                                    if (err) {
                                                        console.error("Error fetching department:", err);
                                                        reject(err);
                                                    } else if (data.length > 0) {
                                                        console.log("Department found:", data[0]);
                                                        resolve(data[0].d_id);
                                                    } else {
                                                        console.log("Department not found for name:", departmentName);
                                                        resolve(null);
                                                    }
                                                }
                                            );
                                        });
                                    }
                                    
                                    const departmentId = await getDepartmentIdByName(department);
                                    if (!departmentId) {
                                        console.log("Department name provided:", department);
                                        return res.status(404).json({ message: 'Department not found' });
                                    }

                                    dbConfig.execute(` insert into student (
                                        s_first_name,s_last_name,s_middle_name,s_password,s_DOB,s_email,s_gender,s_department_id,s_national_id,s_admin_id
                                        )
                                        values(?,?,?,?,?,?,?,?,?,?) ` ,
            
                                        [firstName, lastName, middleName, hashPassword, DOB, email, gander, departmentId ,numberNational, admin_nationalID] , 
                                        async(err , data) => {
                                            if(err || !data.affectedRows === 0){
                                                return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                                            }

                                            const studentID = data.insertId;
                                            const phoneQueries = morePhones.map((phone) => {
                                                return new Promise((resolve, reject) => {
                                                    dbConfig.execute(
                                                            `INSERT INTO student_phone(sp_phone, sp_student_id) VALUES (?, ?)`,
                                                        [phone , studentID] , 
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
                                                    res , message:"Student and phone added successfully" , status: 201 ,
                                                    data: {
                                                        admin:{
                                                            nationalID:studentID ,
                                                            fullName: `${firstName} ${lastName} `,
                                                            email,
                                                            numberNational,
                                                            gander,
                                                            DOB
                                                        },
                                                        phone: phones
                                                    }
                                                })
                                            })
        
                                            // try {
                                            
                                            //     return successResponse({
                                            //         res , message:"Instructor and phone added successfully" , status: 201 ,
                                            //         data: {
                                            //             admin:{
                                            //                 nationalID:studentID ,
                                            //                 fullName: `${firstName} ${lastName} `,
                                            //                 email,
                                            //                 numberNational,
                                            //                 gander,
                                            //                 DOB
                                            //             },
                                            //             phone: encryptedPhones
                                            //         }
                                            //     })
                                            // }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        )
    }
);







export default addStudent;
