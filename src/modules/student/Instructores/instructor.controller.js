import dbConfig from "../../../DB/connection.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

export const getInstructors = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user.id;

    const query = `
      SELECT 
        i.i_id AS Instructor_ID, 
        i.i_firstName AS First_Name, 
        i.i_lastName AS Last_Name
      FROM Instructors AS i
      JOIN courses AS c ON i.i_id = c.c_instructorId
      JOIN enrollment AS e ON c.c_id = e.e_courseId
      WHERE e_studentId = ?
      ORDER BY  i.i_firstName;
    `;

    const [results] = await dbConfig.promise().query(query, [studentId]);

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No instructors found for this student",
      });
    }

    successResponse(res, 200, results);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructors",
      error: error.message,
    });
  }
});

export const getInstructorProfile = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user.id;
    const instructorId = req.params.id;

    const checkEnrollmentQuery = `
      SELECT 1 FROM enrollment AS e
      INNER JOIN courses AS c ON c.c_id = e.e_courseId
      WHERE e.e_studentId = ? AND c.c_instructorId = ?
      LIMIT 1;
    `;

    const [enrollmentCheck] = await dbConfig
      .promise()
      .query(checkEnrollmentQuery, [studentId, instructorId]);

    if (!enrollmentCheck.length) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You are not enrolled in any course by this instructor.",
      });
    }

    const query = `
      SELECT  i.*
      FROM Instructors AS i
      JOIN courses AS c ON i.i_id = c.c_instructorId
      JOIN enrollment AS e ON c.c_id = e.e_courseId
      WHERE i.i_id = ?
      GROUP BY i.i_id;
    `;

    const [results] = await dbConfig.promise().query(query, [instructorId]);

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found.",
      });
    }

    successResponse(res, 200, results[0]); // إرسال بيانات المعلم للطالب
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor profile.",
      error: error.message,
    });
  }
});
