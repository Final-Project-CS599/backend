import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { emailEvent } from "../../../../utils/events/sendEmailEvent.js";
import { generateEncryption } from "../../../../utils/hash/encryption.js";
import { generateHash } from "../../../../utils/hash/hash.js";



const addStudent = errorAsyncHandler(
    async (req ,res ,next) => {
        const {admin_nationalID,firstName  , lastName , middleName, password , 
            confirmPassword ,DOB ,email  , gander ,numberNational , department  , phone1 , phone2
        } = req.body; 
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'The password and re-password do not match' });
        }
        const morePhones = {};
        if(phone1){
            morePhones.phone1 = phone1;
        }
        if(phone2){
            morePhones.phone2 = phone2;
        }

        dbConfig.execute( `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?` , 
            [admin_nationalID] ,
            (err , adminData) => {
                if (err) {
                    return next(new Error("Error verifying admin/superAdmin role" , {cause: 500}))
                }
                if (!adminData.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add instructors" , {cause: 403}))
                }

                dbConfig.execute(`select * from student where s_email =?` ,[email] , (err , data) => {
                    if(err){
                        return next(new Error(`Error Server Database Failed to get data check email ${err.message}` , {cause: 500}))
                    }
                    else if(data.length){
                        return next(new Error(`Student email already exists` , {cause: 409}));
                    }
                    else{
                        dbConfig.execute(`select * from student where s_national_id =?` ,[numberNational] ,
                            async (err , data) => {
                                if(err){
                                    return next(new Error(`Error Server Database Failed to get data check nationalId , execute query: ${err.message}`, {cause:500}));
                                }
                                else if(data.length){
                                    return next(new Error(`Student numberNational already exists` , {cause: 409}));
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

                                    dbConfig.execute(` insert into student (
                                        s_first_name,s_last_name,s_middle_name,s_password,s_DOB,s_email,s_gender,s_department_id,s_national_id,s_admin_id
                                        )
                                        values(?,?,?,?,?,?,?,?,?,?) ` ,
            
                                        [firstName, lastName, middleName, hashPassword, DOB, email, gander, departmentId ,numberNational, admin_nationalID] , 
                                        async(err , data) => {
                                            if(err || !data.affectedRows === 0){
                                                return next(new Error(`Error Server Database Failed to get data ,execute query: ${err.message}`, {cause:500}));
                                            }

                                            const studentID = data.insertId;
                                            const phoneQueries = Object.entries(morePhones).map(([key , phone]) => {
                                                return new Promise((resolve, reject) => {
                                                    dbConfig.execute(
                                                        `INSERT INTO student_phone(sp_phone, sp_student_id) VALUES (?, ?)`,
                                                        [phone, studentID] , 
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
                                                    res , message:"Student added successfully" , status: 201 ,
                                                    data: {
                                                        Student:{
                                                            nationalID:studentID ,
                                                            fullName: `${firstName} ${lastName} `,
                                                            email,
                                                            numberNational,
                                                            gander,
                                                            DOB
                                                        },
                                                        phone: phonesResult
                                                    }
                                                })
                                            });
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
