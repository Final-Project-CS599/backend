import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";



export const addCourses = errorAsyncHandler(
    async (req, res, next) => {
        const {
            adminNid, courseName, courseType, courseDescription, courseCategory, courseStartDate, courseEndDate,
            instructorName 
        } = req.body;

        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ? `, [adminNid],
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
                    (err, data) => {
                        if (err) {
                            return next(new Error("Error verifying instructor", { cause: 500 }));
                        }
                        if (!data.length) {
                            return next(new Error("Instructor not found", { cause: 404 }));
                        }

                        const instructorId = data[0].i_id;
                        dbConfig.execute(`
                                SELECT * FROM courses WHERE c_name = ? AND c_instructorId = ? 
                                AND c_start_date = ? AND c_end_date = ?
                            `,
                            [courseName, instructorId ,courseStartDate, courseEndDate],
                            (err, data) => {
                                if (err) {
                                    return next(new Error("Error checking course existence", { cause: 500 }));
                                }

                                if (data.length > 0) {
                                    return next(new Error("Course , Instructor  and date already exists ", { cause: 409 }));
                                }

                                dbConfig.execute(
                                    `INSERT INTO courses (
                                        c_name, c_type, c_description, c_category, c_start_date, c_end_date, c_adminNid, c_instructorId
                                    ) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ? )`,
                                    [ 
                                        courseName, courseType, courseDescription, courseCategory, courseStartDate, 
                                        courseEndDate, adminNid, instructorId 
                                    ] ,
                                    (err, data) => {
                                        if (err || data.affectedRows === 0) {
                                            return next(new Error(`Failed to add data, Fail to execute query`, { cause: 500 }));
                                        }

                                        return successResponse({
                                            res, message: "Course added successfully", status: 201,
                                            data: {
                                                name: courseName,
                                                type: courseType,
                                                description: courseDescription,
                                                category: courseCategory,
                                                startDate: courseStartDate,
                                                endDate: courseEndDate,
                                                adminNid: adminNid,
                                                instructorId: instructorId,
                                                instructorName: instructorName,
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

export const updateCourses = errorAsyncHandler(
    async (req, res, next) => {
        const {
            adminNid, courseNameUpdate, courseType, courseDescription, courseCategory,
            courseStartDate, courseEndDate, instructorName, courseName
        } = req.body;

        dbConfig.execute(`SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?`, [adminNid],
            (err, data) => {
                if (err) {
                    return next(new Error("Error verifying admin/superAdmin role", { cause: 500 }));
                }
                if (!data.length) {
                    return next(new Error("Access denied, Only admins or superAdmins can add courses", { cause: 403 }));
                }

                const [instructorFirstName, instructorLastName] = instructorName.split(' ');

                dbConfig.execute(`SELECT * FROM Instructors WHERE i_firstName = ? AND i_lastName = ?`,
                    [instructorFirstName, instructorLastName],
                    (err, data) => {
                        if (err) {
                            return next(new Error("Error verifying instructor", { cause: 500 }));
                        }
                        if (!data.length) {
                            return next(new Error("Instructor not found", { cause: 404 }));
                        }
                        const instructorId = data[0].i_id;

                        dbConfig.execute(`SELECT * FROM courses WHERE c_name = ?`, [courseName], (err, data) => {
                            if (err) {
                                return next(new Error("Error checking course existence", { cause: 500 }));
                            }
                            if (!data.length) {
                                return next(new Error("Course not found", { cause: 404 }));
                            }
                            dbConfig.execute(`
                                    UPDATE courses SET c_name = ?, c_type = ?, c_description = ?, c_category = ?, 
                                    c_start_date = ?, c_end_date = ?, c_adminNid = ?, c_instructorId = ? 
                                    WHERE c_name = ?
                                `,
                                [
                                    courseNameUpdate, courseType, courseDescription, courseCategory,
                                    courseStartDate, courseEndDate, adminNid, instructorId, courseName
                                ],
                                (err, data) => {
                                    if (err) {
                                        return next(new Error(`Error update course ${err.message}`, { cause: 500 }));
                                    }
                        
                                    if (data.affectedRows === 0) {
                                        return next(new Error("Course not found", { cause: 404 }));
                                    }
                        
                                    return successResponse({res, message: "Course Updated Successfully", status: 200,
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
                                        }
                                    });
                                }
                            );
                        });
                    }
                );
            }
        );
    }
);


//update Student
// export const updateCoursesStudent = errorAsyncHandler(
//     async (req, res, next) => {
//         const { studentName, courseName } = req.body;

//         const [studentFirstName, studentLastName, studentMiddleName] = studentName.split(' ');

//         dbConfig.execute(
//             `SELECT * FROM student WHERE s_first_name = ? AND s_last_name = ? AND s_middle_name = ?`,
//             [studentFirstName, studentLastName, studentMiddleName],
//             (err, data) => {
//                 if (err) {
//                     return next(new Error(`Error verifying student data`, { cause: 500 }));
//                 }
//                 if (!data.length) {
//                     return next(new Error("Student not found", { cause: 404 }));
//                 }

//                 const studentId = data[0].s_id;

//                 dbConfig.execute( `SELECT * FROM courses WHERE c_name = ?`, [courseName],
//                     (err, data) => {
//                         if (err) {
//                             return next(new Error("Error check course existence", { cause: 500 }));
//                         }
//                         if (!data.length) {
//                             return next(new Error("Course not found", { cause: 404 }));
//                         }

//                         const courseId = data[0].c_id;

//                         dbConfig.execute(
//                             `UPDATE courses SET c_studentId = ? WHERE c_id = ?`, [studentId, courseId], 
//                             (err, result) => {
//                                 if (err) {
//                                     return next(new Error(`Error updating course with student ID: ${err.message}`, { cause: 500 }));
//                                 }
//                                 if (result.affectedRows === 0) {
//                                     return next(new Error("Course not found or no changes made", { cause: 404 }));
//                                 }

//                                 return successResponse({
//                                     res,
//                                     message: "Student added to course successfully",
//                                     status: 200,
//                                     data: {
//                                         courseId: courseId, 
//                                         studentId: studentId,
//                                         studentName: studentName,
//                                     }
//                                 });
//                             }
//                         );
//                     }
//                 );
//             }
//         );
//     }
// );


export const getAllCourses = errorAsyncHandler(
    async (req, res, next) => {
    dbConfig.execute(
        `SELECT courses.c_name as courseName, courses.c_type as courseType, 
                courses.c_description as courseDescription, courses.c_category as courseCategory, 
                courses.c_start_date as courseStartDate, courses.c_end_date as courseEndDate, 
                CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) as instructorName 
        FROM courses 
        JOIN Instructors ON courses.c_instructorId = Instructors.i_id`, 
        (err, data) => {
            if (err) {
                return next(new Error("Error Server", { cause: 500 }));
            }

            return successResponse({
                res, message: "Fetch Courses Successfully", status: 200,
                    data: data
            });
        }
    );
});


export const deletedCourses = errorAsyncHandler(
    async (req, res, next) => {
        const { courseName, courseCode } = req.body;

        dbConfig.execute(
            `SELECT * FROM courses WHERE c_name = ?`, [courseName],
            (err, courseData) => {
                if (err) {
                    return next(new Error("Error Server", { cause: 500 }));
                }

                if (courseData.length === 0) {
                    return next(new Error("Course not found in courses table", { cause: 404 }));
                }

                dbConfig.execute(
                    `DELETE FROM academic WHERE aCourse_code = ?`, [courseCode],
                    (err, academicData) => {
                        if (err) {
                            return next(new Error("Error Server", { cause: 500 }));
                        }

                        dbConfig.execute(
                            `DELETE FROM courses WHERE c_name = ?`, [courseName],
                            (err, courseDeleteData) => {
                                if (err) {
                                    return next(new Error("Error Server", { cause: 500 }));
                                }
                                return successResponse({
                                    res,
                                    message: academicData.affectedRows > 0
                                        ? "Course and related academic data deleted successfully"
                                        : "Course deleted successfully, but no related academic data found",
                                    status: 200
                                });
                            }
                        );
                    }
                );
            }
        );
    }
);

