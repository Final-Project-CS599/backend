import dbConfig from '../../../../DB/connection.js';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';

export const updateCourses = errorAsyncHandler(async (req, res, next) => {
  const {
    adminNid,
    courseNameUpdate,
    courseType,
    courseDescription,
    courseCategory,
    courseStartDate,
    courseEndDate,
    instructorName,
    courseName,
  } = req.body;

  dbConfig.execute(
    `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?`,
    [adminNid],
    (err, data) => {
      if (err) {
        return next(new Error('Error verifying admin/superAdmin role', { cause: 500 }));
      }
      if (!data.length) {
        return next(
          new Error('Access denied, Only admins or superAdmins can add courses', { cause: 403 })
        );
      }

      const [instructorFirstName, instructorLastName] = instructorName.split(' ');

      dbConfig.execute(
        `SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
        [instructorFirstName, instructorLastName],
        (err, data) => {
          if (err) {
            return next(new Error('Error verifying instructor', { cause: 500 }));
          }
          if (!data.length) {
            return next(new Error('Instructor not found', { cause: 404 }));
          }
          const instructorId = data[0].i_id;

          dbConfig.execute(`SELECT * FROM courses WHERE c_name = ?`, [courseName], (err, data) => {
            if (err) {
              return next(new Error('Error checking course existence', { cause: 500 }));
            }
            if (!data.length) {
              return next(new Error('Course not found', { cause: 404 }));
            }
            dbConfig.execute(
              `
                                    UPDATE courses SET c_name = ?, c_type = ?, c_description = ?, c_category = ?, 
                                    c_start_date = ?, c_end_date = ?, c_adminNid = ?, c_instructorId = ? 
                                    WHERE c_name = ?
                                `,
              [
                courseNameUpdate,
                courseType,
                courseDescription,
                courseCategory,
                courseStartDate,
                courseEndDate,
                adminNid,
                instructorId,
                courseName,
              ],
              (err, data) => {
                if (err) {
                  return next(new Error(`Error update course ${err.message}`, { cause: 500 }));
                }

                if (data.affectedRows === 0) {
                  return next(new Error('Course not found', { cause: 404 }));
                }

                return successResponse({
                  res,
                  message: 'Course Updated Successfully',
                  status: 200,
                  data: {
                    name: courseNameUpdate,
                    type: courseType,
                    description: courseDescription,
                    category: courseCategory,
                    startDate: courseStartDate,
                    endDate: courseEndDate,
                    adminNid: adminNid,
                    instructorId: instructorId,
                    instructorName: instructorName,
                  },
                });
              }
            );
          });
        }
      );
    }
  );
});

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

export const deletedCourses = errorAsyncHandler(async (req, res, next) => {
  const { courseName, courseCode } = req.body;

  // Input validation
  if (!courseName || !courseCode) {
    return next(new Error('Course name and course code are required', { status: 400 }));
  }

  // Start a transaction
  const connection = await dbConfig.getConnection();
  await connection.beginTransaction();

  try {
    // Check if the course exists
    const [courseData] = await connection.execute(`SELECT * FROM courses WHERE c_name = ?`, [
      courseName,
    ]);
    if (courseData.length === 0) {
      await connection.rollback();
      return next(new Error('Course not found in courses table', { status: 404 }));
    }

    // Delete related academic data
    const [academicData] = await connection.execute(`DELETE FROM academic WHERE aCourse_code = ?`, [
      courseCode,
    ]);

    // Delete the course
    const [courseDeleteData] = await connection.execute(`DELETE FROM courses WHERE c_name = ?`, [
      courseName,
    ]);

    // Commit the transaction
    await connection.commit();

    // Send success response
    return successResponse({
      res,
      message:
        academicData.affectedRows > 0
          ? 'Course and related academic data deleted successfully'
          : 'Course deleted successfully, but no related academic data found',
      status: 200,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await connection.rollback();
    return next(new Error(`Error deleting course: ${err.message}`, { status: 500 }));
  } finally {
    // Release the connection
    connection.release();
  }
});
