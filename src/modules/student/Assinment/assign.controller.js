import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const studentAssignment = asyncHandler(async (req, res) => {
  try {
    const { course_id } = req.params;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    const assignmentQuery = `
      SELECT * 
      FROM assignment 
      WHERE a_courseId = ?;
    `;

    dbConfig.query(assignmentQuery, [course_id], (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch assignments',
          error: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No assignments found for the given course ID',
        });
      }

      res.status(200).json({
        success: true,
        assignments: results,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

export const submitAssignment = asyncHandler(async (req, res) => {
  try {
    const ta_student_id = req.user.id;
    const { ta_assignment_id } = req.body;

    if (!ta_student_id || !ta_assignment_id) {
      return res.status(400).json({
        success: false,
        message: !ta_student_id
          ? 'All fields (ta_student_id) are required'
          : 'All fields (ta_assignment_id) are required',
      });
    }

    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM assignment WHERE a_id = ?
      ) AS assignmentExists,
      EXISTS (
        SELECT 1 FROM student WHERE s_id = ?
      ) AS studentExists
    `;

    dbConfig.query(checkQuery, [ta_assignment_id, ta_student_id], (checkError, checkResults) => {
      if (checkError) {
        return res.status(500).json({
          success: false,
          message: 'Database error during validation',
          error: checkError.message,
        });
      }

      const { assignmentExists, studentExists } = checkResults[0];

      if (!assignmentExists || !studentExists) {
        return res.status(404).json({
          success: false,
          message: 'Assignment or Student not found',
        });
      }

      const insertQuery = `
          INSERT INTO takes_assignment (ta_assignment_id, ta_student_id)
          VALUES (?, ?)
        `;

      dbConfig.query(
        insertQuery,
        [ta_assignment_id, ta_student_id],
        (insertError, insertResults) => {
          if (insertError) {
            return res.status(500).json({
              success: false,
              message: 'Failed to submit assignment',
              error: insertError.message,
            });
          }

          res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            submission_id: insertResults.insertId,
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});
