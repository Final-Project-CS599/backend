import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";



export const addAcademic = errorAsyncHandler(
    async (req, res, next) => {
        const {
            adminNationalID,courseName, courseCode, instructorName, department, courseType, category, description, courseStartDate, courseEndDate
        } = req.body;

        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? `, [adminNationalID],
            (err, data) => {
                if (err) {
                    return next(new Error("Error Server Database admin/superAdmin ", { cause: 500 }));
                }
                if (!data.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add courses", { cause: 403 }));
                }

                const [instructorFirstName, instructorLastName] = instructorName.split(' ');

                dbConfig.execute(
                    `SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
                    [instructorFirstName, instructorLastName],
                    (err, instructorData) => {
                        if (err) {
                            return next(new Error("Error Server verify instructor", { cause: 500 }));
                        }
                        if (!instructorData.length) {
                            return next(new Error("Instructor not found", { cause: 404 }));
                        }
                        const instructorId = instructorData[0].i_id;

                        dbConfig.execute(
                            `SELECT * FROM courses WHERE c_adminNid =? AND c_name = ? AND c_type = "Academic" AND c_instructorId = ? AND c_description = ? AND c_category = ? AND c_start_date = ? AND c_end_date = ?`,
                            [adminNationalID,courseName, instructorId, description, category, courseStartDate, courseEndDate],
                            (err, courseData) => {
                                if (err) {
                                    return next(new Error("Error check course", { cause: 500 }));
                                }
                                if (courseData.length) {
                                    return next(new Error("Course already exists", { cause: 409 }));
                                }

                                dbConfig.execute(
                                    `INSERT INTO courses (c_adminNid ,c_name, c_type, c_instructorId, c_description, c_category, c_start_date, c_end_date)
                                    VALUES (? , ?, 'Academic', ?, ?, ?, ?, ?)`,
                                    [adminNationalID,courseName, instructorId, description, category, courseStartDate, courseEndDate],
                                    (err, dataCourse) => {
                                        if (err) {
                                            return next(new Error("Error Server add course", { cause: 500 }));
                                        }

                                        const courseId = dataCourse.insertId;

                                        dbConfig.execute(
                                            `SELECT * FROM department WHERE d_dept_name = ?`,
                                            [department],
                                            (err, dataDepartment) => {
                                                if (err) {
                                                    return next(new Error("Error Server department", { cause: 500 }));
                                                }
                                                if (!dataDepartment.length) {
                                                    return next(new Error("Department not found", { cause: 404 }));
                                                }
                                                const departmentId = dataDepartment[0].d_id;

                                                dbConfig.execute(
                                                    `SELECT * FROM academic WHERE aCourse_code = ?`,
                                                    [courseCode],
                                                    (err, dataAcademic) => {
                                                        if (err) {
                                                            return next(new Error("Error check academic record", { cause: 500 }));
                                                        }
                                                        if (dataAcademic.length) {
                                                            return next(new Error("Academic record already exists", { cause: 409 }));
                                                        }

                                                        dbConfig.execute(
                                                            `INSERT INTO academic (course_id, aDepartment_id, aCourse_code)
                                                            VALUES (?, ?, ?)`,
                                                            [courseId, departmentId, courseCode],
                                                            (err, academicResult) => {
                                                                if (err) {
                                                                    return next(new Error(`Error Server add academic  ${err.message}`, { cause: 500 }));
                                                                }
                                                                return successResponse({ res, message: "Academic added successfully",
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
                                                                        endDate: courseEndDate
                                                                    }
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
        )
    }
); 

export const updateAcademic = errorAsyncHandler(
    async (req, res, next) => {
        const {
            adminNationalID,courseNameUpdate, courseCodeUpdata, instructorName, department, courseType, category, description, courseStartDate,
            courseEndDate, courseCode, courseName
        } = req.body;

        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? `, [adminNationalID],
            (err, data) => {
                if (err) {
                    return next(new Error("Error Server Database admin/superAdmin ", { cause: 500 }));
                }
                if (!data.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add courses", { cause: 403 }));
                }

                const [instructorFirstName, instructorLastName] = instructorName.split(' ');

                dbConfig.execute(`SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
                    [instructorFirstName, instructorLastName],
                    (err, instructorData) => {
                        if (err) {
                            return next(new Error("Error Server verify instructor", { cause: 500 }));
                        }
                        if (!instructorData.length) {
                            return next(new Error("Instructor not found", { cause: 404 }));
                        }
                        const instructorId = instructorData[0].i_id;

                        dbConfig.execute(
                            `SELECT * FROM courses WHERE c_adminNid =? AND c_name = ? AND c_type = "Academic" AND c_instructorId = ? AND c_description = ? AND c_category = ?
                            AND c_start_date = ? AND c_end_date = ?`,
                            [adminNationalID ,courseName, instructorId, description, category, courseStartDate, courseEndDate],
                            (err, courseData) => {
                                if (err) {
                                    return next(new Error("Error check course", { cause: 500 }));
                                }
                                if (courseData.length) {
                                    return next(new Error("Course already exists", { cause: 409 }));
                                }

                                dbConfig.execute(
                                    `UPDATE courses SET c_adminNid  =? ,c_name = ?, c_type = "Academic", c_instructorId = ?, c_description = ?, c_category = ?, 
                                    c_start_date = ?, c_end_date = ? WHERE c_name = ?`,
                                    [adminNationalID ,courseNameUpdate, instructorId, description, category, courseStartDate, courseEndDate, courseName],
                                    (err, courseData) => {
                                        if (err) {
                                            return next(new Error(`Error Server add course ${err.message}`, { cause: 500 }));
                                        }
                                        if (courseData.affectedRows === 0) {
                                            return next(new Error("Course not found", { cause: 404 }));
                                        }

                                        dbConfig.execute(
                                            `SELECT c_id FROM courses WHERE c_name = ?`,
                                            [courseNameUpdate],
                                            (err, courseIdData) => {
                                                if (err) {
                                                        return next(new Error("Error fetching course ID", { cause: 500 }));
                                                }
                                                if (!courseIdData.length) {
                                                        return next(new Error("Course ID not found", { cause: 404 }));
                                                }
                                                const courseId = courseIdData[0].c_id;

                                                dbConfig.execute(`SELECT * FROM department WHERE d_dept_name = ?`,
                                                        [department],
                                                        (err, dataDepartment) => {
                                                        if (err) {
                                                            return next(new Error("Error Server department", { cause: 500 }));
                                                        }
                                                        if (!dataDepartment.length) {
                                                            return next(new Error("Department not found", { cause: 404 }));
                                                        }
                                                        const departmentId = dataDepartment[0].d_id;

                                                        dbConfig.execute(`SELECT * FROM academic WHERE aCourse_code = ?`, [courseCode],
                                                            (err, dataAcademic) => {
                                                                if (err) {
                                                                    return next(new Error("Error Server academic", { cause: 500 }));
                                                                }
                                                                if (!dataAcademic.length) {
                                                                    return next(new Error("Academic not found", { cause: 404 }));
                                                                }

                                                                dbConfig.execute(
                                                                    `UPDATE academic SET course_id = ?, aDepartment_id = ?, aCourse_code = ? WHERE aCourse_code = ?`,
                                                                    [courseId, departmentId, courseCodeUpdata, courseCode],
                                                                    (err, academicData) => {
                                                                        if (err) {
                                                                            return next(new Error(`Error Server academic`, { cause: 500 }));
                                                                        }
                                                                        if (academicData.affectedRows === 0) {
                                                                            return next(new Error(`Academic record not found or not updated`, { cause: 404 }));
                                                                        }
                                                                        return successResponse({ res, message: "Academic updated successfully",
                                                                            status: 200,
                                                                            data: {
                                                                                adminNationalID,
                                                                                courseName: courseNameUpdate,
                                                                                courseCode,
                                                                                courseCodeUpdata,
                                                                                instructorName,
                                                                                department,
                                                                                courseType : "Academic",
                                                                                category,
                                                                                description,
                                                                                startDate: courseStartDate,
                                                                                endDate: courseEndDate
                                                                            }
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
            }
        );
    }
);


export const getAllCoursesAcademic = errorAsyncHandler(
    async (req, res, next) => {
        dbConfig.execute(
            `SELECT 
                courses.c_id AS courseId,
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
            `,
            (err, data) => {
                if (err) {
                    return next(new Error(`Error Server ${err.message}`, { cause: 500 }));
                }

                if (!data.length) {
                    return next(new Error("No academic courses found", { cause: 404 }));
                }

                return successResponse({
                    res,
                    message: "Academic courses retrieved successfully",
                    status: 200,
                    data: data
                });
            }
        );
    }
);





