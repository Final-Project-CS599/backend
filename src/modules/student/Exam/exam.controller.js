import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

const getexam = asyncHandler(async (req, res) => {
  const query = `
        SELECT 
          
    `;

  dbConfig.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch the Exam ",
        error: error.message,
      });
    }

    successResponse(res, 200, results);
  });
});

export default getexam;
