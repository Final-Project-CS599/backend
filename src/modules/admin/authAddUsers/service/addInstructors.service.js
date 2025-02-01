import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { emailEvent } from "../../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../../utils/hash/encryption.js";
import { generateHash } from "../../../../utils/hash/hash.js";


const addInstructor = errorAsyncHandler(
    async (req, res ,next) => {
        const {admin_nationalID,firstName , lastName , email , password , confirmPassword , department , phone1 , phone2} = req.body;
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'The password and confirmPassword do not match' });
        }
        
        const morePhones = {};
        if(phone1){
            morePhones.phone1 = phone1;
        }
        if(phone2){
            morePhones.phone2 = phone2;
        }

        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?` , 
            [admin_nationalID] ,
            (err , adminData) => {
                if (err) {
                    return next(new Error("Error verifying admin/superAdmin role" , {cause: 500}))
                }
                if (!adminData.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add instructors" , {cause: 403}))
                }
    
                dbConfig.execute(`select * from Instructors where i_email =?` , [email] ,
                    async (err , data) => {
                        if (err) {
                            return next(new Error(`Error Server Database Failed to get data check email ${err.message}`, {cause: 500}))
                        }
                        else if (data.length) {
                            return next(new Error(`Instructors email already exists` , {cause: 409}))
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
                                                reject(err);
                                            } else if (data.length > 0) {
                                                resolve(data[0].d_id);
                                            } else {
                                                resolve(null);
                                            }
                                        }
                                    );
                                });
                            }
                        
                            const departmentId = await getDepartmentIdByName(department);
                            if (!departmentId) {
                                return next(new Error(`Department not found ` , {cause: 404}));
                            }

                            dbConfig.execute(` insert into Instructors (
                                i_firstName,i_lastName,i_email,i_password,i_departmentId,i_adminId
                                ) 
                                values (?,?,?,?,?,?) ` ,[firstName , lastName , email , hashPassword , departmentId , admin_nationalID] , 
                                async (err , data) => {
                                    if (err) {
                                        return next(new Error(`Error Server Database Failed to get data ,execute query: ${err.message}`, {cause:500}));
                                    }

                                    const instructorId = data.insertId;
                                    const phoneQueries = Object.entries(morePhones).map(([key , phone]) => {
                                        return new Promise((resolve, reject) => {
                                            dbConfig.execute(
                                                `INSERT INTO InstructorsPhone(p_instructorPhone, i_instructorId) VALUES (?, ?)`,
                                                [phone, instructorId] , 
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
                                            res , message:"Instructor added successfully" , status: 201 ,
                                            data: {
                                                Instructor:{
                                                    nationalID:instructorId ,
                                                    fullName: `${firstName} ${lastName} `,
                                                    email,
                                                },
                                                phone: phonesResult
                                            }
                                        })
                                    });
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
