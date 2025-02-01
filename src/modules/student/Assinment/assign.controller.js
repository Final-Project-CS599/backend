import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

const studentAssignment = asyncHandler(async (req, res) => {
  try {
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // استعلام واحد باستخدام JOIN لجلب Assignments مباشرةً
    const assignmentQuery = `
      SELECT A.* 
      FROM assignment A
      JOIN content C ON A.content_id = C.id
      WHERE C.course_id = ?;
    `;

    // تنفيذ الاستعلام وتمرير course_id
    dbConfig.query(assignmentQuery, [course_id], (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch assignments",
          error: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No assignments found for the given course ID",
        });
      }

      // إرجاع النتائج في استجابة JSON
      res.status(200).json({
        success: true,
        assignments: results,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

export default studentAssignment;
