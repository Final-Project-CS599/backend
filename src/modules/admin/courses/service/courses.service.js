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

  // Check if the course exists in the courses table
  dbConfig.query(`SELECT * FROM courses WHERE c_name = ?`, [courseName], (error, courseData) => {
    if (error) {
      console.error('Error checking course:', error);
      return next({ message: 'Internal server error', status: 500 });
    }

    if (courseData.length === 0) {
      return next({ message: 'Course not found in courses table', status: 404 });
    }

    const courseId = courseData[0].c_id; // Assuming c_id is the primary key in the courses table

    // Delete related records from the extra_course table
    dbConfig.query(
      `DELETE FROM Extra WHERE e_courseId = ?`,
      [courseId],
      (error, extraCourseDeleteData) => {
        if (error) {
          console.error('Error deleting from extra_course:', error);
          return next({ message: 'Internal server error', status: 500 });
        }

        //  Delete related records from the academic table
        dbConfig.query(
          `DELETE FROM academic WHERE aCourse_code = ?`,
          [courseCode],
          (error, academicDeleteData) => {
            if (error) {
              console.error('Error deleting from academic:', error);
              return next({ message: 'Internal server error', status: 500 });
            }

            // Delete the course from the courses table
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
