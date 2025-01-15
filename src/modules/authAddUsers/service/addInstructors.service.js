import dbConfig from "../../../DB/connection.js";
import { errorAsyncHandler } from "../../../utils/error/error.handling.js";
import { emailEvent } from "../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { successResponse } from "../../../utils/response/success.response.js";



const addInstructor = errorAsyncHandler(
    async (req, res ,next) => {
        const {admin_nationalID,firstName , lastName , email , password , confirmPassword , department ,phones} = req.body;
    
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
    
                dbConfig.execute(`select * from Instructors where i_email =?` , [email] ,
                    async (err , data) => {
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

                            dbConfig.execute(` insert into Instructors (
                                i_firstName,i_lastName,i_email,i_password,i_departmentId,i_adminId
                                ) 
                                values (?,?,?,?,?,?) ` ,[firstName , lastName , email , hashPassword , departmentId , admin_nationalID] , 
                                async (err , data) => {
                                    if (err) {
                                        return next(new Error(`Failed to add data , Fail to execute query ${err.message}` , {cause: 500} ))
                                        // return res.status(500).json({ message: 'Failed to add data , Fail to execute query', error: err });
                                        // const error = new Error("Failed to add data, Fail to execute query", { cause: 500 });
                                        //     error.details = err; 
                                        //     return next(error);
                                    }

                                    const instructorId = data.insertId;
                                    const phoneQueries = morePhones.map((phone) => {
                                        return new Promise((resolve, reject) => {
                                            dbConfig.execute(
                                                    `INSERT INTO InstructorsPhone(p_instructorPhone, i_instructorId) VALUES (?, ?)`,
                                                [phone , instructorId] , 
                                                (err ,data) => {
                                                    if(err || !data.affectedRows){
                                                        reject(err)
                                                    }
                                                    resolve(phone);
                                                }
                                            )
                                        })
                                    })
                                    emailEvent.emit("sendEmail" , {email , password});

                                    Promise.all(phoneQueries).then((phones)=>{
                                        return successResponse({
                                            res , message:"Instructor and phone added successfully" , status: 201 ,
                                            data: {
                                                admin:{
                                                    nationalID:instructorId ,
                                                    fullName: `${firstName} ${lastName} `,
                                                    email,
                                                },
                                                phone: phones
                                            }
                                        })
                                    })

                                    // try {
                                    // return successResponse({
                                    //     res , message:"Instructor and phone added successfully" , status: 201 ,
                                    //     data: {
                                    //         admin:{
                                    //             nationalID:instructorId ,
                                    //             fullName: `${firstName} ${lastName} `,
                                    //             email,
                                    //         },
                                    //         phone: encryptedPhones
                                    //     }
                                    // })
                                    // }
                                }
                            );
                        }
                    }
                )
            }
        )
    }
);


export default addInstructor;

