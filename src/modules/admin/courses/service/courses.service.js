import dbConfig from '../../../../DB/connection.js';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';

export const getAllCourses = errorAsyncHandler(async (req, res, next) => {
  dbConfig.execute(
    `SELECT courses.c_id as courseId, courses.c_name as courseName, courses.c_type as courseType, 
                courses.c_description as courseDescription, courses.c_category as courseCategory, 
                courses.c_start_date as courseStartDate, courses.c_end_date as courseEndDate, 
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName 
        FROM courses 
        JOIN Instructors ON courses.c_instructorId = Instructors.i_id`,
    (err, data) => {
      if (err) {
        return next(new Error('Error Server', { cause: 500 }));
      }

      return successResponse({
        res,
        message: 'Fetch Courses Successfully',
        status: 200,
        data: data,
      });
    }
  );
});

// export const deletedCourses = errorAsyncHandler(async (req, res, next) => {
//   const { courseName, courseCode } = req.body;

//   // Input validation
//   if (!courseName || !courseCode) {
//     return next(new Error('Course name and course code are required', { status: 400 }));
//   }

//   // Start a transaction
//   const connection = await dbConfig.getConnection();
//   await connection.beginTransaction();

//   try {
//     // Check if the course exists
//     const [courseData] = await connection.execute(`SELECT * FROM courses WHERE c_name = ?`, [
//       courseName,
//     ]);
//     if (courseData.length === 0) {
//       await connection.rollback();
//       return next(new Error('Course not found in courses table', { status: 404 }));
//     }

//     // Delete related academic data
//     const [academicData] = await connection.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [
//       courseCode,

//     ]);

//     // Delete the course
//     const [courseDeleteData] = await connection.execute(`DELETE FROM courses WHERE c_name = ?`, [
//       courseName,
//     ]);

//     // Commit the transaction
//     await connection.commit();

//     // Send success response
//     return successResponse({
//       res,
//       message:
//         academicData.affectedRows > 0
//           ? 'Course and related academic data deleted successfully'
//           : 'Course deleted successfully, but no related academic data found',
//       status: 200,
//     });
//   } catch (err) {
//     // Rollback the transaction in case of error
//     await connection.rollback();
//     return next(new Error(`Error deleting course: ${err.message}`, { status: 500 }));
//   } finally {
//     // Release the connection
//     connection.release();
//   }
// });

// export const deletedCourse = errorAsyncHandler(async (req, res, next) => {
//   const { courseName, courseCode } = req.body;

//   // التحقق من البيانات المدخلة
//   if (!courseName || !courseCode) {
//     return next(new Error('Course name and course code are required', { status: 400 }));
//   }

//   // إنشاء اتصال بقاعدة البيانات
//   const connection = await dbConfig.getConnection();
//   await connection.beginTransaction();

//   try {
//     // البحث عن c_id الخاص بالكورس
//     const [courseData] = await connection.execute(
//       `SELECT c_id FROM courses WHERE c_name = ?`,
//       [courseName]
//     );

//     if (courseData.length === 0) {
//       await connection.rollback();
//       return next(new Error('Course not found', { status: 404 }));
//     }

//     const courseId = courseData[0].c_id;

//     // حذف البيانات من جدول Extra
//     await connection.execute(`DELETE FROM Extra WHERE e_courseId = ?`, [courseId]);

//     // حذف البيانات من جدول Academic
//     await connection.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [courseCode]);

//     // حذف الكورس من جدول Courses
//     await connection.execute(`DELETE FROM courses WHERE c_id = ?`, [courseId]);

//     // تأكيد العملية
//     await connection.commit();

//     return successResponse({
//       res,
//       message: 'Course and all related data deleted successfully',
//       status: 200,
//     });
//   } catch (err) {
//     await connection.rollback();
//     return next(new Error(`Error deleting course: ${err.message}`, { status: 500 }));
//   } finally {
//     connection.release();
//   }
// });
