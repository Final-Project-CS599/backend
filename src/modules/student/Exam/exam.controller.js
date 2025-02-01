import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

export const getexam = asyncHandler(async (req, res) => {
  try {
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const examQuery = `
      SELECT * 
      FROM exam 
      WHERE e_courseId = ?;
    `;

    dbConfig.query(examQueryQuery, [course_id], (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch exam",
          error: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No exam found for the given course ID",
        });
      }

      res.status(200).json({
        success: true,
        exams: results,
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

export const takeExam = asyncHandler(async (req, res) => {
  try {
    const tExam_studentId = req.user.id;
    const { tExam_examId } = req.body;

    if (!tExam_examId || !tExam_studentId) {
      return res.status(400).json({
        success: false,
        message: !tExam_studentId
          ? "All fields (tExam_studentId) are required"
          : "All fields (tExam_examId) are required",
      });
    }

    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM exam WHERE e_id = ?
      ) AS examExists,
      EXISTS (
        SELECT 1 FROM student WHERE s_id = ?
      ) AS studentExists
    `;

    dbConfig.query(
      checkQuery,
      [tExam_examId, tExam_studentId],
      (checkError, checkResults) => {
        if (checkError) {
          return res.status(500).json({
            success: false,
            message: "Database error during validation",
            error: checkError.message,
          });
        }

        const { examExists, studentExists } = checkResults[0];

        if (!examExists || !studentExists) {
          return res.status(404).json({
            success: false,
            message: "Exam or Student not found",
          });
        }

        const insertQuery = `
        INSERT INTO takesExam (tExam_examId, tExam_studentId)
        VALUES (?, ?)
      `;

        dbConfig.query(
          insertQuery,
          [tExam_examId, tExam_studentId],
          (insertError, insertResults) => {
            if (insertError) {
              return res.status(500).json({
                success: false,
                message: "Failed to submit Exam",
                error: insertError.message,
              });
            }

            res.status(201).json({
              success: true,
              message: "Exam submitted successfully",
              submission_id: insertResults.insertId,
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});
