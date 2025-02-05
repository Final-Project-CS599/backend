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
  const { courseName, courseCode } = req.body;

  // التحقق من المدخلات
  if (!courseName || !courseCode) {
    return next({ message: 'Course name and course code are required', status: 400 });
  }

  // بداية المعاملة (Transaction)
  const connection = await dbConfig.getConnection(); // الحصول على اتصال من مجموعة الاتصالات
  await connection.beginTransaction();

  try {
    // التحقق مما إذا كان الكورس موجودًا في جدول الكورسات
    const [courseData] = await connection.execute(`SELECT * FROM courses WHERE c_name = ?`, [courseName]);
    if (courseData.length === 0) {
      await connection.rollback();
      return next({ message: 'Course not found in courses table', status: 404 });
    }

    // حذف البيانات المرتبطة بالكورس في جدول الأكاديميك
    const [academicData] = await connection.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [courseCode]);

    // حذف الكورس من جدول الكورسات
    const [courseDeleteData] = await connection.execute(`DELETE FROM courses WHERE c_name = ?`, [courseName]);

    // إتمام المعاملة
    await connection.commit();

    // إرسال استجابة ناجحة
    return successResponse({
      res,
      message: academicData.affectedRows > 0
        ? 'Course and related academic data deleted successfully'
        : 'Course deleted successfully, but no related academic data found',
      status: 200,
    });
  } catch (err) {
    // في حالة حدوث خطأ، نقوم بالتراجع عن المعاملة
    await connection.rollback();
    return next({ message: `Error deleting course: ${err.message}`, status: 500 });
  } finally {
    // إعادة الاتصال إلى مجموعة الاتصالات
    if (connection) connection.release();
  }
});



// export const deletedCourse = errorAsyncHandler(async (req, res, next) => {
//   const { courseName, courseCode } = req.body;

//   if (!courseName || !courseCode) {
//     return next(new Error('Course name and course code are required', { status: 400 }));
//   }

//   let connection;
//   try {
//     connection = await dbConfig.connection();  
//     await connection.beginTransaction();

//     const [courseData] = await connection.execute(
//       `SELECT c_id FROM courses WHERE c_name = ? AND c_code = ?`,
//       [courseName, courseCode]
//     );

//     if (!courseData || courseData.length === 0) {
//       await connection.rollback();
//       return next(new Error('Course not found', { status: 404 }));
//     }

//     const courseId = courseData[0].c_id;

//     const [extraData] = await connection.execute(
//       `SELECT e_courseId FROM Extra WHERE e_courseId = ?`,
//       [courseId]
//     );

//     const [academicData] = await connection.execute(
//       `SELECT aCourse_code FROM academic WHERE aCourse_code = ?`,
//       [courseCode]
//     );

//     if (extraData.length > 0) {
//       await connection.execute(`DELETE FROM Extra WHERE e_courseId = ?`, [courseId]);
//     }

//     if (academicData.length > 0) {
//       await connection.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [courseCode]);
//     }

//     await connection.execute(`DELETE FROM courses WHERE c_id = ?`, [courseId]);

//     await connection.commit();

//     return successResponse({
//       res,
//       message: 'Course and related data deleted successfully',
//       status: 200,
//     });
//   } catch (err) {
//     if (connection) await connection.rollback();
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
//   await connection.beginTransaction();

//   try {
//     // البحث عن c_id الخاص بالكورس باستخدام courseName
//     const [courseData] = await connection.execute(
//       `SELECT c_id, c_type FROM courses WHERE c_name = ? AND c_code = ?`, 
//       [courseName, courseCode]
//     );

//     // التحقق من وجود الكورس
//     if (courseData.length === 0) {
//       await connection.rollback();
//       throw new Error('Course not found');
//     }

//     const courseId = courseData[0].c_id;
//     const courseType = courseData[0].c_type;

//     // إذا كان الكورس من نوع Extra، نقوم بحذفه من جدول Extra
//     if (courseType === 'Extra') {
//       await connection.execute(`DELETE FROM Extra WHERE e_courseId = ?`, [courseId]);
//     }

//     // إذا كان الكورس من نوع Academic، نقوم بحذفه من جدول Academic
//     if (courseType === 'Academic') {
//       await connection.execute(`DELETE FROM academic WHERE course_id = ?`, [courseId]);
//     }

//     // حذف الكورس من جدول Courses
//     await connection.execute(`DELETE FROM courses WHERE c_id = ?`, [courseId]);

//     // تأكيد العملية
//     await connection.commit();

//     return successResponse({
//       res,
//       message: 'Course and related data deleted successfully',
//       status: 200,
//     });

//   } catch (err) {
//     await connection.rollback();
//     throw new Error(`Error deleting course: ${err.message}`);
//   } finally {
//     // تحرير الاتصال بعد الانتهاء
//     connection.release();
//   }
// });

