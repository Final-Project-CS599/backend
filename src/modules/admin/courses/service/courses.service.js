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

export const deletedCourse = errorAsyncHandler(async (req, res, next) => {
  const { courseName, courseCode } = req.query; // Access query parameters

  if (!courseName || !courseCode) {
    return next({ message: 'Course name and course code are required', status: 400 });
  }

  // Step 1: Check if the course exists in the courses table
  dbConfig.query(`SELECT * FROM courses WHERE c_name = ?`, [courseName], (error, courseData) => {
    if (error) {
      console.error('Error checking course:', error);
      return next({ message: 'Internal server error', status: 500 });
    }

    if (courseData.length === 0) {
      return next({ message: 'Course not found in courses table', status: 404 });
    }

    const courseId = courseData[0].c_id; // Assuming c_id is the primary key in the courses table

    // Step 2: Delete related records from the extra_course table
    dbConfig.query(
      `DELETE FROM Extra WHERE e_courseId = ?`,
      [courseId],
      (error, extraCourseDeleteData) => {
        if (error) {
          console.error('Error deleting from extra_course:', error);
          return next({ message: 'Internal server error', status: 500 });
        }

        // Step 3: Delete related records from the academic table
        dbConfig.query(
          `DELETE FROM academic WHERE aCourse_code = ?`,
          [courseCode],
          (error, academicDeleteData) => {
            if (error) {
              console.error('Error deleting from academic:', error);
              return next({ message: 'Internal server error', status: 500 });
            }

            // Step 4: Delete the course from the courses table
            dbConfig.query(
              `DELETE FROM courses WHERE c_name = ?`,
              [courseName],
              (error, courseDeleteData) => {
                if (error) {
                  console.error('Error deleting from courses:', error);
                  return next({ message: 'Internal server error', status: 500 });
                }

                // Success response
                return successResponse({
                  res,
                  message:
                    extraCourseDeleteData.affectedRows > 0 || academicDeleteData.affectedRows > 0
                      ? 'Course and all related data deleted successfully'
                      : 'Course deleted successfully, but no related data found',
                  status: 200,
                });
              }
            );
          }
        );
      }
    );
  });
});

// export const deletedCourse = errorAsyncHandler(async (req, res, next) => {
//   const { courseName, courseCode } = req.body;

//   if (!courseName || !courseCode) {
//     return next(new Error('Course name and course code are required', { status: 400 }));
//   }

//   let connection;
//   try {
//     connection = await dbConfig.connection();
//    dbConfig.beginTransaction();

//     const [courseData] =dbConfig.execute(
//       `SELECT c_id FROM courses WHERE c_name = ? AND c_code = ?`,
//       [courseName, courseCode]
//     );

//     if (!courseData || courseData.length === 0) {
//      dbConfig.rollback();
//       return next(new Error('Course not found', { status: 404 }));
//     }

//     const courseId = courseData[0].c_id;

//     const [extraData] =dbConfig.execute(
//       `SELECT e_courseId FROM Extra WHERE e_courseId = ?`,
//       [courseId]
//     );

//     const [academicData] =dbConfig.execute(
//       `SELECT aCourse_code FROM academic WHERE aCourse_code = ?`,
//       [courseCode]
//     );

//     if (extraData.length > 0) {
//      dbConfig.execute(`DELETE FROM Extra WHERE e_courseId = ?`, [courseId]);
//     }

//     if (academicData.length > 0) {
//      dbConfig.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [courseCode]);
//     }

//    dbConfig.execute(`DELETE FROM courses WHERE c_id = ?`, [courseId]);

//    dbConfig.commit();

//     return successResponse({
//       res,
//       message: 'Course and related data deleted successfully',
//       status: 200,
//     });
//   } catch (err) {
//     if (connection)dbConfig.rollback();
//     return next(new Error(`Error deleting course: ${err.message}`, { status: 500 }));
//   } finally {
//     if (connection) connection.release();
//   }
// });

// export const deleteCourse = errorAsyncHandler(async (req, res, next) => {
//   const { courseName, courseCode } = req.body;

//   // التحقق من وجود البيانات المدخلة
//   if (!courseName || !courseCode) {
//     throw new Error('Course name and course code are required');
//   }

//   // إنشاء اتصال بقاعدة البيانات
//   const connection = await dbConfig.promise().getConnection();
//  dbConfig.beginTransaction();

//   try {
//     // البحث عن c_id الخاص بالكورس باستخدام courseName
//     const [courseData] =dbConfig.execute(
//       `SELECT c_id, c_type FROM courses WHERE c_name = ? AND c_code = ?`,
//       [courseName, courseCode]
//     );

//     // التحقق من وجود الكورس
//     if (courseData.length === 0) {
//      dbConfig.rollback();
//       throw new Error('Course not found');
//     }

//     const courseId = courseData[0].c_id;
//     const courseType = courseData[0].c_type;

//     // إذا كان الكورس من نوع Extra، نقوم بحذفه من جدول Extra
//     if (courseType === 'Extra') {
//      dbConfig.execute(`DELETE FROM Extra WHERE e_courseId = ?`, [courseId]);
//     }

//     // إذا كان الكورس من نوع Academic، نقوم بحذفه من جدول Academic
//     if (courseType === 'Academic') {
//      dbConfig.execute(`DELETE FROM academic WHERE course_id = ?`, [courseId]);
//     }

//     // حذف الكورس من جدول Courses
//    dbConfig.execute(`DELETE FROM courses WHERE c_id = ?`, [courseId]);

//     // تأكيد العملية
//    dbConfig.commit();

//     return successResponse({
//       res,
//       message: 'Course and related data deleted successfully',
//       status: 200,
//     });

//   } catch (err) {
//    dbConfig.rollback();
//     throw new Error(`Error deleting course: ${err.message}`);
//   } finally {
//     // تحرير الاتصال بعد الانتهاء
//     connection.release();
//   }
// });
