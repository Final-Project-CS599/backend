// import pool from '../../../../DB/connection.js'; 
// import { errorAsyncHandler } from '../../../../utils/response/error.response.js';

// const getDashboardStats = errorAsyncHandler(async () => {  
//     try {
//         const connection = await pool.getConnection();
        
//         const [[{ studentsCount }]] = await connection.query("SELECT COUNT(*) AS studentsCount FROM student");
//         const [[{ coursesCount }]] = await connection.query("SELECT COUNT(*) AS coursesCount FROM courses");
//         const [[{ instructorsCount }]] = await connection.query("SELECT COUNT(*) AS instructorsCount FROM Instructors");

//         connection.release(); 

//         return { studentsCount, coursesCount, instructorsCount }; 
//     } catch (error) {
//         console.error(" Error ", error);
//         throw error;
//     }
// });

// export { getDashboardStats };
