import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

const studentAssignment = asyncHandler(async (req, res) => {
  const { course_id } = req.body;

  // Query to select content based on course_id
  const contentQuery = `
    SELECT id 
    FROM content 
    WHERE course_id = ?
  `;

  dbConfig.query(contentQuery, [course_id], (contentError, contentResults) => {
    if (contentError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch content",
        error: contentError.message,
      });
    }

    // Extract content IDs from the results
    const contentIds = contentResults.map((content) => content.id);

    if (contentIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No content found for the given course ID",
      });
    }

    // Query to select assignments based on content IDs
    const assignmentQuery = `
      SELECT * 
      FROM assignment 
      WHERE content_id IN (?)
    `;

    dbConfig.query(
      assignmentQuery,
      [contentIds],
      (assignmentError, assignmentResults) => {
        if (assignmentError) {
          return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments",
            error: assignmentError.message,
          });
        }

        // Return the assignments
        successResponse(res, 200, assignmentResults);
      }
    );
  });
});

export default studentAssignment;
