import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
// دالة لإرسال إجابة الواجب

const submitAssignment = asyncHandler(async (req, res) => {
  try {
    const { assignment_id, student_id, content } = req.body;

    //  التحقق من صحة البيانات المدخلة
    if (!assignment_id || !student_id || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields (assignment_id, student_id, content) are required",
      });
    }

    // التحقق مما إذا كان الـ assignment_id والـ student_id موجودين بالفعل في قاعدة البيانات
    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM assignment WHERE id = ?
      ) AS assignmentExists,
      EXISTS (
        SELECT 1 FROM student WHERE id = ?
      ) AS studentExists
    `;

    dbConfig.query(
      checkQuery,
      [assignment_id, student_id],
      (checkError, checkResults) => {
        if (checkError) {
          return res.status(500).json({
            success: false,
            message: "Database error during validation",
            error: checkError.message,
          });
        }

        const { assignmentExists, studentExists } = checkResults[0];

        if (!assignmentExists || !studentExists) {
          return res.status(404).json({
            success: false,
            message: "Assignment or Student not found",
          });
        }

        //  إدخال إجابة الطالب في قاعدة البيانات
        const insertQuery = `
        INSERT INTO takes_assignment (assignment_id, student_id, content)
        VALUES (?, ?, ?)
      `;

        dbConfig.query(
          insertQuery,
          [assignment_id, student_id, content],
          (insertError, insertResults) => {
            if (insertError) {
              return res.status(500).json({
                success: false,
                message: "Failed to submit assignment",
                error: insertError.message,
              });
            }

            res.status(201).json({
              success: true,
              message: "Assignment submitted successfully",
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

export default submitAssignment;
