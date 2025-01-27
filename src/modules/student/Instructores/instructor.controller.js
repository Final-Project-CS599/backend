import dbConfig from "../../../DB/connection.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

const getInstructors = asyncHandler(async (req, res) => {
  const query = `
        SELECT 
            i_firstName,i_lastName,c_name,
            FROM  instructors as in
        INNER JOIN courses as co ON in.i_id = co.c_instructorId
        INNER JOIN enrollment as er ON co.c_id = er.e_courseId
        INNER JOIN students as st ON er.e_studentId = st.s_id
        GROUP BY 
            i_id
        ORDER BY 
            i_firstName;
    `;

  dbConfig.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch the instructors ",
        error: error.message,
      });
    }

    successResponse(res, 200, results);
  });
});

export default getInstructors;
