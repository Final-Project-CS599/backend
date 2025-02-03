// import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
// import { successResponse } from '../../../../utils/response/success.response.js';
// import dbConfig from '../../../../DB/connection.js';
// import { compareHash } from '../../../../utils/hash/hash.js';
// import { generateToken } from '../../../../utils/token/token.js';
// import { roleTypes } from '../../../../middleware/auth.middleware.js';



// const loginUtility = async (
//         tableName, emailColumn, passwordColumn, idColumn, roleColumn, updatedAtColumn, firstNameColumn,
//         lastNameColumn, middleNameColumn , email, password, department ,confirmEmail , res, next
//     ) => {
//     return new Promise((resolve, reject) => {
//         dbConfig.execute(
//             `SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`,
//             [email],
//             async (err, userData) => {
//                 if (err) {
//                     return reject({ status: 500, message: `Error Server Database Failed to get data : ${err.message}`, error: err });
//                 }
//                 if (!userData.length) {
//                     return resolve(null);
//                 }

//                 const user = userData[0];

//                 console.log("confirmEmail:", confirmEmail);
//                 console.log("user confirmEmail:", user[confirmEmail]);

//                 if (user[confirmEmail] !== 1){
//                     return reject(JSON.stringify({status: 400, message: "In_valid account user not confirmEmail , please check your email" }));
//                 }
                
//                 const match = compareHash({ plainText: password, hashValue: user[passwordColumn] });
//                 console.log(email,tableName,user[passwordColumn])
//                 if (!match) { 
//                     return resolve(null)
//                     // return reject(JSON.stringify({ status: 401, message: "Invalid password" }));
//                     // return reject(JSON.stringify({ status: 401, message: `Invalid password ${password}` }));
//                 }

//                 await dbConfig.execute(
//                     `UPDATE ${tableName} SET ${updatedAtColumn} = NOW() WHERE ${emailColumn} = ?`,
//                     [email]
//                 );

//                 const tokenPayload = { id: user[idColumn], isLoggedIn: true, role: user[roleColumn] };

//                 let signature ;
//                 if(user[roleColumn] === roleTypes.Admin || user[roleColumn] === roleTypes.SuperAdmin){
//                     signature = process.env.TOKEN_SIGNATURE_ADMIN; 
//                 }
//                 else if (user[roleColumn] === roleTypes.Instructor || user[roleColumn] === roleTypes.Student){
//                     signature = process.env.TOKEN_SIGNATURE;
//                 }
//                 else{
//                     signature = process.env.TOKEN_SIGNATURE; 
//                 }

//                 const token = generateToken({
//                     payload: tokenPayload,
//                     signature: signature,
//                     // options: { expiresIn: '24h' }
//                 });

//                 let fullName;
//                 if( middleNameColumn){
//                     fullName = `${user[firstNameColumn]} ${user[lastNameColumn]} ${user[middleNameColumn]}`;
//                 }
//                 else{
//                     fullName = `${user[firstNameColumn]} ${user[lastNameColumn]}`;
//                 }

//                 return resolve({ 
//                     token , 
//                     id: user[idColumn],
//                     fullName,
//                     email: user[emailColumn],
//                     department: user[department],
//                     role: user[roleColumn]
//                 });
//             }
//         );
//     });
// };

// const login = errorAsyncHandler(
//     async (req, res, next) => {
//         const { email, password } = req.body;

//         try {
//             const superAdminResult = await loginUtility(
//                 'superAdmin',
//                 'sAdmin_email',
//                 'sAdmin_password',
//                 'sAdmin_nationalID',
//                 'sAdmin_role',
//                 'sAdmin_updatedAt',
//                 'sAdmin_firstName',
//                 'sAdmin_lastName',
//                 null,
//                 email,
//                 password,
//                 null,
//                 'sAdmin_active',
//                 res,
//                 next
//             );

//             if (superAdminResult) {
//                 return successResponse({ 
//                     res, 
//                     message: "Welcome SuperAdmin to your account (login)",
//                     status: 200, 
//                     data: { token: superAdminResult.token , userId: superAdminResult.id ,
//                         fullName: superAdminResult.fullName,
//                         email: superAdminResult.email,
//                         role: superAdminResult.role
//                     } 
//                 });
//             }

//             const instructorsResult = await loginUtility(
//                 'Instructors',
//                 'i_email',
//                 'i_password',
//                 'i_id',
//                 null,
//                 'i_updatedAt',
//                 'i_firstName',
//                 'i_lastName',
//                 null,
//                 email,
//                 password,
//                 'i_departmentId',
//                 'i_active',
//                 res,
//                 next
//             );

//             if (instructorsResult) {
//                 return successResponse({ 
//                     res,
//                     message: "Welcome Instructor to your account (login)", 
//                     status: 200, 
//                     data: { token: instructorsResult.token , userId: instructorsResult.id,
//                         fullName: instructorsResult.fullName,
//                         email: instructorsResult.email,
//                         department: instructorsResult.department,
//                         role: roleTypes.Instructor
//                     } 
//                 });
//             }
//             const studentResult = await loginUtility(
//                 'student',
//                 's_email',
//                 's_password',
//                 's_id',
//                 null,
//                 's_updated_at',
//                 's_first_name',
//                 's_last_name',
//                 's_middle_name',
//                 email,
//                 password,
//                 's_department_id',
//                 's_active',
//                 res,
//                 next
//             );
//             if (studentResult) {
//                 return successResponse({ 
//                     res, 
//                     message: "Welcome Student to your account (login)", 
//                     status: 200, 
//                     data: { token: studentResult.token , userId: studentResult.id,
//                         fullName: studentResult.fullName,
//                         email: studentResult.email,
//                         department: studentResult.department,
//                         role: roleTypes.Student
//                     } 
//                 });
//             }
//             console.log(studentResult)

//             return next(new Error("User not found",{ cause: 404 }));
//         } catch (error) {
//             const errorObj = JSON.parse(error);
//             return next(new Error(errorObj.message, { cause: errorObj.status }));
//         }
//     }
// );

// export default login;


import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';
import { compareHash } from '../../../../utils/hash/hash.js';
import { generateToken } from '../../../../utils/token/token.js';
import { roleTypes } from '../../../../middleware/auth.middleware.js';

const loginUtility = async (
    tableName, emailColumn, passwordColumn, idColumn, roleColumn, updatedAtColumn, firstNameColumn,
    lastNameColumn, middleNameColumn, email, password, department, confirmEmail, res, next
) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(
            `SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`,
            [email],
            async (err, userData) => {
                if (err) {
                    return reject({ status: 500, message: `Database error: ${err.message}`, error: err });
                }
                if (!userData.length) {
                    return resolve(null);
                }

                const user = userData[0];
                
                if (user[confirmEmail] !== 1) {
                    return reject({ status: 400, message: "Invalid account, user not confirmed. Please check your email." });
                }

                const match = compareHash({ plainText: password, hashValue: user[passwordColumn] });
                if (!match) {
                    return resolve(null);
                }

                dbConfig.execute(
                    `UPDATE ${tableName} SET ${updatedAtColumn} = NOW() WHERE ${emailColumn} = ?`,
                    [email]
                );

                const userRole = roleColumn ? user[roleColumn] : null;
                let signature = process.env.TOKEN_SIGNATURE;
                if (userRole === roleTypes.Admin || userRole === roleTypes.SuperAdmin) {
                    signature = process.env.TOKEN_SIGNATURE_ADMIN;
                }

                const token = generateToken({
                    payload: { id: user[idColumn], isLoggedIn: true, role: userRole },
                    signature: signature,
                });

                const fullName = middleNameColumn
                    ? `${user[firstNameColumn]} ${user[lastNameColumn]} ${user[middleNameColumn]}`
                    : `${user[firstNameColumn]} ${user[lastNameColumn]}`;

                return resolve({ 
                    token, 
                    id: user[idColumn],
                    fullName,
                    email: user[emailColumn],
                    department: user[department],
                    role: userRole
                });
            }
        );
    });
};

const login = errorAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const superAdminResult = await loginUtility(
            'superAdmin', 'sAdmin_email', 'sAdmin_password', 'sAdmin_nationalID', 'sAdmin_role',
            'sAdmin_updatedAt', 'sAdmin_firstName', 'sAdmin_lastName', null, email, password, null, 'sAdmin_active', res, next
        );
        if (superAdminResult) {
            return successResponse({ res, message: "Welcome SuperAdmin", status: 200, data: superAdminResult });
        }

        const instructorsResult = await loginUtility(
            'Instructors', 'i_email', 'i_password', 'i_id', null, 'i_updatedAt', 'i_firstName',
            'i_lastName', null, email, password, 'i_departmentId', 'i_active', res, next
        );
        if (instructorsResult) {
            instructorsResult.role = roleTypes.Instructor;
            return successResponse({ res, message: "Welcome Instructor", status: 200, data: instructorsResult });
        }

        const studentResult = await loginUtility(
            'student', 's_email', 's_password', 's_id', null, 's_updated_at', 's_first_name',
            's_last_name', 's_middle_name', email, password, 's_department_id', 's_active', res, next
        );
        if (studentResult) {
            studentResult.role = roleTypes.Student;
            return successResponse({ res, message: "Welcome Student", status: 200, data: studentResult });
        }

        const error = new Error("User not found");
        error.statusCode = 404;
        return next(error);
    } catch (error) {
        if (error.status) {
            return next(new Error(error.message, { cause: error.status }));
        }
        return next(new Error("Internal Server Error", { cause: 500 }));
    }
});

export default login;
