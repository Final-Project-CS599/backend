import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";



export const addExtra = errorAsyncHandler(
    async (req, res, next) => {
        const {
            adminNationalID, instructorName, courseName, courseCode, price, category, description, courseStartDate, courseEndDate ,
            sections
        } = req.body;

        dbConfig.execute(
            `SELECT * FROM superAdmin WHERE sAdmin_nationalID = ?`,
            [adminNationalID],
            (err, adminData) => {
                if (err) {
                    return next(new Error("Error Server Database admin/superAdmin", { cause: 500 }));
                }
                if (!adminData.length) {
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
                            `SELECT * FROM courses WHERE c_adminNid = ? AND c_name = ? AND c_type = "Extra" AND c_instructorId = ? AND c_description = ? AND c_category = ? AND c_start_date = ? AND c_end_date = ?`,
                            [adminNationalID, courseName, instructorId, description, category, courseStartDate, courseEndDate],
                            (err, courseData) => {
                                if (err) {
                                    return next(new Error("Error check course", { cause: 500 }));
                                }
                                if (courseData.length) {
                                    return next(new Error("Course already exists", { cause: 409 }));
                                }

                                dbConfig.execute(
                                    `INSERT INTO courses (c_adminNid, c_name, c_type, c_instructorId, c_description, c_category, c_start_date, c_end_date)
                                    VALUES (?, ?, 'Extra', ?, ?, ?, ?, ?)`,
                                    [adminNationalID, courseName, instructorId, description, category, courseStartDate, courseEndDate],
                                    (err, dataCourse) => {
                                        if (err) {
                                            return next(new Error("Error Server add course", { cause: 500 }));
                                        }

                                        const courseId = dataCourse.insertId;

                                        dbConfig.execute(
                                            `SELECT * FROM Extra WHERE e_Course_code = ?`,
                                            [courseCode],
                                            (err, dataExtra) => {
                                                if (err) {
                                                    return next(new Error("Error check Extra record", { cause: 500 }));
                                                }
                                                if (dataExtra.length) {
                                                    return next(new Error("Extra record already exists", { cause: 409 }));
                                                }

                                                dbConfig.execute(
                                                    `INSERT INTO Extra (e_courseId, e_Course_code, e_sections, e_price)
                                                    VALUES (?, ?, ? , ?)`,
                                                    [courseId, courseCode, sections ,price],
                                                    (err, extraResult) => {
                                                        if (err) {
                                                            return next(new Error(`Error Server add Extra record: ${err.message}`, { cause: 500 }));
                                                        }

                                                        return successResponse({
                                                            res,
                                                            message: "Extra course added successfully",
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

