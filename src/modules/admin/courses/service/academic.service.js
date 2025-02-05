import dbConfig from '../../../../DB/connection.js';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';


//add academic couses
export const addAcademic = errorAsyncHandler(async (req, res, next) => {
  const adminNationalID = req.user.id;

  console.log('Received body:', req.body);
  console.log('adminNationalID:', adminNationalID);

  const {
    courseName,
    courseCode,
    instructorName,
    department,
    category,
    description,
    courseStartDate,
    courseEndDate,
  } = req.body;

  if (
    !adminNationalID ||
    !instructorName ||
    !courseName ||
    !courseCode ||
    !category ||
    !description ||
    !courseStartDate ||
    !courseEndDate ||
    !department
  ) {
    return next(new Error('All fields are required', { cause: 400 }));
  }

  dbConfig.execute(
    `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? `,
    [adminNationalID],
    (err, data) => {
      if (err) {
        return next(new Error('Error Server Database admin/superAdmin ', { cause: 500 }));
      }
      if (!data.length) {
        return next(
          new Error('Access denied, Only admins or superAdmins can add courses', { cause: 403 })
        );
      }

      const instructorNameParts = instructorName.trim().split(' ');
      const instructorFirstName = instructorNameParts[0] || null;
      const instructorLastName = instructorNameParts.slice(1).join(' ') || null;
      dbConfig.execute(
        `SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
        [instructorFirstName, instructorLastName],
        (err, instructorData) => {
          if (err) {
            return next(new Error('Error Server verify instructor', { cause: 500 }));
          }
          if (!instructorData.length) {
            return next(new Error('Instructor not found', { cause: 404 }));
          }
          console.log('Instructor data:', instructorData); // Log instructor data
          console.log('Instructor data:', instructorData); // Log instructor data

          const instructorId = instructorData[0].i_id;

          dbConfig.execute(
            `SELECT * FROM courses WHERE c_adminNid =? AND c_name = ? AND c_type = "Academic" AND c_instructorId = ? AND c_description = ? AND c_category = ? AND c_start_date = ? AND c_end_date = ?`,
            [
              adminNationalID,
              courseName,
              instructorId,
              description,
              category,
              courseStartDate,
              courseEndDate,
            ],
            (err, courseData) => {
              if (err) {
                return next(new Error('Error check course', { cause: 500 }));
              }
              if (courseData.length) {
                return next(new Error('Course already exists', { cause: 409 }));
              }

              dbConfig.execute(
                `INSERT INTO courses (c_adminNid ,c_name, c_type, c_instructorId, c_description, c_category, c_start_date, c_end_date)
                                    VALUES (? , ?, 'Academic', ?, ?, ?, ?, ?)`,
                [
                  adminNationalID,
                  courseName,
                  instructorId,
                  description,
                  category,
                  courseStartDate,
                  courseEndDate,
                ],
                (err, dataCourse) => {
                  if (err) {
                    return next(new Error('Error Server add course', { cause: 500 }));
                  }

                  const id = dataCourse.insertId;

                  dbConfig.execute(
                    `SELECT * FROM department WHERE d_dept_name = ?`,
                    [department],
                    (err, dataDepartment) => {
                      if (err) {
                        return next(new Error('Error Server department', { cause: 500 }));
                      }
                      if (!dataDepartment.length) {
                        return next(new Error('Department not found', { cause: 404 }));
                      }
                      const departmentId = dataDepartment[0].d_id;

                      dbConfig.execute(
                        `SELECT * FROM academic WHERE aCourse_code = ?`,
                        [courseCode],
                        (err, dataAcademic) => {
                          if (err) {
                            return next(new Error('Error check academic record', { cause: 500 }));
                          }
                          if (dataAcademic.length) {
                            return next(
                              new Error('Academic record already exists', { cause: 409 })
                            );
                          }

                          dbConfig.execute(
                            `INSERT INTO academic (course_id, aDepartment_id, aCourse_code)
                                                            VALUES (?, ?, ?)`,
                            [id, departmentId, courseCode],
                            (err, academicResult) => {
                              if (err) {
                                return next(
                                  new Error(`Error Server add academic  ${err.message}`, {
                                    cause: 500,
                                  })
                                );
                              }
                              return successResponse({
                                res,
                                message: 'Academic added successfully',
                                status: 201,
                                data: {
                                  adminNationalID,
                                  courseName,
                                  courseCode,
                                  instructorName,
                                  department,
                                  courseType: 'Academic',
                                  category,
                                  description,
                                  startDate: courseStartDate,
                                  endDate: courseEndDate,
                                },
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

//update academic courses
export const updateAcademic = errorAsyncHandler(async (req, res, next) => {
  const adminNationalID = req.user.id;// Admin ID from authenticated user
  const { id } = req.params; // Course ID to update
  const {
    instructorName,
    department,
    category,
    description,
    courseStartDate,
    courseEndDate,
    courseCode,
    courseName,
  } = req.body;

  // Validate required fields
  if (
    !instructorName ||
    !department ||
    !category ||
    !description ||
    !courseStartDate ||
    !courseEndDate ||
    !courseCode ||
    !courseName
  ) {
    return next(new Error('All fields are required', { cause: 400 }));
  }

  dbConfig.execute(
    `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?`,
    [adminNationalID],
    (err, adminData) => {
      if (err) {
        return next(new Error('Error Server Database admin/superAdmin', { cause: 500 }));
      }
      if (!adminData.length) {
        return next(
          new Error('Access denied, Only admins or superAdmins can update courses', { cause: 403 })
        );
      }

      const instructorNameParts = instructorName.trim().split(' ');
      const instructorFirstName = instructorNameParts[0] || null;
      const instructorLastName = instructorNameParts.slice(1).join(' ') || null;

      dbConfig.execute(
        `SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
        [instructorFirstName, instructorLastName],
        (err, instructorData) => {
          if (err) {
            return next(new Error('Error Server verify instructor', { cause: 500 }));
          }
          if (!instructorData.length) {
            return next(new Error('Instructor not found', { cause: 404 }));
          }
          const instructorId = instructorData[0].i_id;

          dbConfig.execute(
            `SELECT * FROM courses WHERE c_id = ? AND c_type = "Academic"`,
            [id],
            (err, courseData) => {
              if (err) {
                return next(new Error('Error checking course', { cause: 500 }));
              }
              if (!courseData.length) {
                return next(new Error('Course not found or unauthorized', { cause: 404 }));
              }

              dbConfig.execute(
                `UPDATE courses 
                 SET c_name = ?, c_instructorId = ?, c_description = ?, c_category = ?, c_start_date = ?, c_end_date = ? 
                 WHERE c_id = ?`,
                [
                  courseName,
                  instructorId,
                  description,
                  category,
                  courseStartDate,
                  courseEndDate,
                  id,
                ],
                (err, updatedCourse) => {
                  if (err) {
                    return next(new Error('Error updating course', { cause: 500 }));
                  }

                  dbConfig.execute(
                    `SELECT * FROM department WHERE d_dept_name = ?`,
                    [department],
                    (err, departmentData) => {
                      if (err) {
                        return next(new Error('Error Server department', { cause: 500 }));
                      }
                      if (!departmentData.length) {
                        return next(new Error('Department not found', { cause: 404 }));
                      }
                      const departmentId = departmentData[0].d_id;

                      dbConfig.execute(
                        `SELECT * FROM academic WHERE aCourse_code = ?`,
                        [courseCode],
                        (err, academicData) => {
                          if (err) {
                            return next(new Error('Error Server academic', { cause: 500 }));
                          }
                          if (!academicData.length) {
                            return next(new Error('Academic record not found', { cause: 404 }));
                          }

                          dbConfig.execute(
                            `UPDATE academic 
                             SET course_id = ?, aDepartment_id = ?, aCourse_code = ? 
                             WHERE aCourse_code = ?`,
                            [id, departmentId, courseCode, courseCode],
                            (err, updatedAcademic) => {
                              if (err) {
                                return next(
                                  new Error('Error updating academic record', { cause: 500 })
                                );
                              }
                              if (updatedAcademic.affectedRows === 0) {
                                return next(
                                  new Error('Academic record not found or not updated', {
                                    cause: 404,
                                  })
                                );
                              }

                              return successResponse({
                                res,
                                message: 'Academic course updated successfully',
                                status: 200,
                                data: {
                                  adminNationalID,
                                  courseName,
                                  courseCode,
                                  instructorName,
                                  department,
                                  courseType: 'Academic',
                                  category,
                                  description,
                                  startDate: courseStartDate,
                                  endDate: courseEndDate,
                                },
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

export const getAllCoursesAcademic = errorAsyncHandler(async (req, res, next) => {
  dbConfig.execute(
    `SELECT
                courses.c_id AS id,
                courses.c_name AS courseName,
                courses.c_type AS courseType,
                courses.c_start_date AS startDate,
                courses.c_end_date AS endDate,
                courses.c_description AS description,
                courses.c_category AS category,
                academic.aCourse_code AS courseCode,
                academic.aDepartment_id AS departmentId,
                department.d_dept_name AS departmentName, 
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName
            FROM courses
            INNER JOIN Instructors ON courses.c_instructorId = Instructors.i_id
            INNER JOIN academic ON courses.c_id = academic.course_id
            INNER JOIN department ON academic.aDepartment_id = department.d_id  
            WHERE courses.c_type = "Academic"
            `,
    (err, data) => {
      if (err) {
        return next(new Error(`Error Server ${err.message}`, { cause: 500 }));
      }

      if (!data.length) {
        return res.status(200).json({ message: 'No Courses found', data: [] });
      }

      return successResponse({
        res,
        message: 'Academic courses retrieved successfully',
        status: 200,
        data: data,
      });
    }
  );
});

export const getCourseAcademic = errorAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  dbConfig.execute(
    `SELECT
                courses.c_id AS id,
                courses.c_name AS courseName,
                courses.c_type AS courseType,
                courses.c_start_date AS startDate,
                courses.c_end_date AS endDate,
                courses.c_description AS description,
                courses.c_category AS category,
                academic.aCourse_code AS courseCode,
                academic.aDepartment_id AS departmentId,
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName
            FROM courses
            INNER JOIN Instructors ON courses.c_instructorId = Instructors.i_id
            INNER JOIN academic ON courses.c_id = academic.course_id
            WHERE courses.c_type = "Academic"
            AND courses.c_id = ?
            `,
    [id],
    (err, data) => {
      if (err) {
        return next(new Error(`Error Server ${err.message}`, { cause: 500 }));
      }

      if (!data.length) {
        return next(new Error('Course not found', { cause: 404 }));
      }

      return successResponse({
        res,
        message: 'Academic course retrieved successfully',
        status: 200,
        data: data[0],
      });
    }
  );
});
