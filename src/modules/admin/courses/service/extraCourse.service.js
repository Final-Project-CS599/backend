import dbConfig from '../../../../DB/connection.js';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';

export const addExtra = errorAsyncHandler(async (req, res, next) => {
  const adminNationalID = req.user.id;

  console.log(adminNationalID, 'adminNationalID');
  const {
    instructorName,
    courseName,
    courseCode,
    price,
    category,
    description,
    courseStartDate,
    courseEndDate,
    sections,
  } = req.body;

  if (
    !adminNationalID ||
    !instructorName ||
    !courseName ||
    !courseCode ||
    !price ||
    !category ||
    !description ||
    !courseStartDate ||
    !courseEndDate ||
    !sections
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
          const instructorId = instructorData[0].i_id;

          dbConfig.execute(
            `SELECT * FROM courses WHERE c_adminNid = ? AND c_name = ? AND c_type = "Extra" AND c_instructorId = ? AND c_description = ? AND c_category = ? AND c_start_date = ? AND c_end_date = ?`,
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
                `INSERT INTO courses (c_adminNid, c_name, c_type, c_instructorId, c_description, c_category, c_start_date, c_end_date)
                                    VALUES (?, ?, 'Extra', ?, ?, ?, ?, ?)`,
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
                    `SELECT * FROM Extra WHERE e_Course_code = ?`,
                    [courseCode],
                    (err, dataExtra) => {
                      if (err) {
                        return next(new Error('Error check Extra record', { cause: 500 }));
                      }
                      if (dataExtra.length) {
                        return next(new Error('Extra record already exists', { cause: 409 }));
                      }
                      const trimmedSection =
                        typeof sections === 'string' ? sections.trim() : sections;

                      // If it's an ENUM, validate against allowed values
                      const allowedSections = [
                        'Back end',
                        'Front end',
                        'languages',
                        'programming',
                        'Digital marketing',
                      ];
                      if (!allowedSections.includes(trimmedSection)) {
                        return next(new Error('Invalid section value', { cause: 400 }));
                      }

                      dbConfig.execute(
                        `INSERT INTO Extra (e_id, e_Course_code, e_sections, e_price)
                                                    VALUES (?, ?, ? , ?)`,
                        [id, courseCode, trimmedSection, price],
                        (err, extraResult) => {
                          if (err) {
                            return next(
                              new Error(`Error Server add Extra record: ${err.message}`, {
                                cause: 500,
                              })
                            );
                          }

                          return successResponse({
                            res,
                            message: 'Extra course added successfully',
                            status: 201,
                            data: {
                              adminNationalID,
                              courseName,
                              courseCode,
                              sections,
                              instructorName,
                              courseType: 'Extra',
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
});

//  Update extra again
export const updateExtra = errorAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const adminNationalID = req.user.id;
  const {
    instructorName,
    courseName,
    courseNameUpdate,
    courseCode,
    courseCodeUpdate,
    price,
    category,
    description,
    courseStartDate,
    courseEndDate,
    sections,
  } = req.body;

  dbConfig.execute(
    `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?`,
    [adminNationalID],
    (err, adminData) => {
      if (err) {
        return next(new Error('Error Server Database admin/superAdmin', { cause: 500 }));
      }
      if (!adminData.length) {
        return next(new Error('the admin not found in DB', { cause: 403 }));
      }
      const [instructorFirstName, instructorLastName] = instructorName.split(' ');

      dbConfig.execute(
        `SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
        [instructorFirstName, instructorLastName],
        (err, instructorData) => {
          if (err) {
            return next(new Error('Error Server update instructor', { cause: 500 }));
          }
          if (!instructorData.length) {
            return next(new Error('Instructor not found', { cause: 404 }));
          }
          const instructorId = instructorData[0].i_id;

          dbConfig.execute(
            `SELECT c_id FROM courses WHERE c_adminNid = ? AND c_name = ? AND c_type = "Extra" AND c_instructorId = ? AND c_description = ? AND c_category = ? AND c_start_date = ? AND c_end_date = ?`,
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

              const id = courseData[0].c_id;

              dbConfig.execute(
                `UPDATE courses SET c_adminNid=?, c_name=?, c_type='Extra', c_instructorId=?, c_description=?, c_category=?, c_start_date=?, c_end_date=?`,
                [
                  adminNationalID,
                  courseNameUpdate,
                  instructorId,
                  description,
                  category,
                  courseStartDate,
                  courseEndDate,
                ],
                (err, dataCourse) => {
                  if (err) {
                    return next(new Error('Error Server update course', { cause: 500 }));
                  }

                  // const id = dataCourse[0].c_id;

                  dbConfig.execute(
                    `SELECT * FROM Extra WHERE e_Course_code = ?`,
                    [courseCode],
                    (err, dataExtra) => {
                      if (err) {
                        return next(new Error('Error server Extra record', { cause: 500 }));
                      }
                      if (!dataExtra.length) {
                        return next(new Error('Extra record already exists', { cause: 409 }));
                      }

                      dbConfig.execute(
                        `UPDATE Extra SET e_id=?, e_Course_code=?, e_sections=?, e_price=? WHERE e_Course_code =?`,
                        [id, courseCodeUpdate, sections, price, courseCode],
                        (err, extraResult) => {
                          if (err) {
                            return next(
                              new Error(`Error Server update Extra record: ${err.message}`, {
                                cause: 500,
                              })
                            );
                          }

                          if (extraResult.affectedRows === 0) {
                            return next(new Error(`This extra course not found`, { cause: 404 }));
                          }
                          return successResponse({
                            res,
                            message: 'Extra course added successfully',
                            status: 201,
                            data: {
                              adminNationalID,
                              courseName,
                              courseNameUpdate,
                              courseCode,
                              courseCodeUpdate,
                              sections,
                              instructorName,
                              courseType: 'Extra',
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
});

export const getAllCoursesExtra = errorAsyncHandler(async (req, res, next) => {
  dbConfig.execute(
    `SELECT 
                courses.c_id AS id,
                courses.c_name AS courseName,
                courses.c_type AS courseType,
                courses.c_start_date AS startDate,
                courses.c_end_date AS endDate,
                courses.c_description AS description,
                courses.c_category AS category,
                Extra.e_Course_code AS CourseCode,
                Extra.e_sections AS sections,
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName
            FROM courses
            INNER JOIN Instructors ON courses.c_instructorId = Instructors.i_id
            INNER JOIN Extra ON courses.c_id = Extra.e_id 
            WHERE courses.c_type = "Extra"
            `,
    (err, data) => {
      if (err) {
        return next(new Error(`Error Server ${err.message}`, { cause: 500 }));
      }

      if (data.length === 0) {
        return successResponse({
          res,
          message: 'No Extra courses found',
          status: 200,
          data: [],
        });
      }

      return successResponse({
        res,
        message: 'Extra courses retrieved successfully',
        status: 200,
        data: data,
      });
    }
  );
});

export const getCourseExtra = errorAsyncHandler(async (req, res, next) => {
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
                Extra.e_Course_code AS courseCode,
                Extra.e_sections AS sections,
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName
            FROM courses
            INNER JOIN Instructors ON courses.c_instructorId = Instructors.i_id
            INNER JOIN Extra ON courses.c_id = Extra.e_id
            WHERE courses.c_type = "Extra"
            AND courses.c_id = ?
            `,
    [id],
    (err, data) => {
      if (err) {
        return next(new Error(`Error Server ${err.message}`, { cause: 500 }));
      }

      if (!data.length) {
        return next(new Error('Extra course not found', { cause: 404 }));
      }

      return successResponse({
        res,
        message: 'Extra course retrieved successfully',
        status: 200,
        data: data[0],
      });
    }
  );
});
