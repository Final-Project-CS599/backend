import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { successResponse } from '../../../utils/response/success.response.js';

export const getInstructors = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const query = `
      SELECT DISTINCT
        i.i_id AS Instructor_ID, 
        i.i_firstName AS First_Name, 
        i.i_lastName AS Last_Name, 
        d.d_id AS Department_ID, 
        d.d_dept_name AS Department_Name
      FROM Instructors AS i
      JOIN department AS d ON i.i_departmentId = d.d_id
      JOIN courses AS c ON i.i_id = c.c_instructorId
      JOIN enrollment AS e ON c.c_id = e.e_courseId
      WHERE e.e_studentId = ?
      ORDER BY i.i_firstName;
    `;

  const [results] = await dbConfig.promise().query(query, [studentId]);

  if (results.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No instructors found for this student',
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'No instructors found for this student',
    data: results,
  });
});

export const getInstructorProfile = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const instructorId = req.params.id; // Fix: Extract the actual instructor ID

  if (!studentId || !instructorId) {
    return res.status(400).json({
      success: false,
      message: 'Student ID and Instructor ID are required.',
    });
  }

  // Ensure instructorId is treated as a number if necessary
  const parsedInstructorId = Number(instructorId);
  if (isNaN(parsedInstructorId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Instructor ID format.',
    });
  }

  // Check if the student is enrolled in a course with this instructor
  const checkEnrollmentQuery = `
      SELECT 1 FROM enrollment AS e
      INNER JOIN courses AS c ON c.c_id = e.e_courseId
      WHERE e.e_studentId = ? AND c.c_instructorId = ?
      LIMIT 1;
    `;

  dbConfig.query(checkEnrollmentQuery, [studentId, parsedInstructorId], (err, enrollmentCheck) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
    if (!enrollmentCheck.length) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not enrolled in any course by this instructor.',
      });
    }
  });

  // Fetch instructor profile including department details
  const query = `
      SELECT 
        i.i_id AS Instructor_ID, 
        i.i_firstName AS First_Name, 
        i.i_lastName AS Last_Name, 
        d.d_dept_name AS Department_Name, 
        GROUP_CONCAT(c.c_name ORDER BY c.c_name SEPARATOR ', ') AS Courses
      FROM Instructors AS i
      JOIN department AS d ON i.i_departmentId = d.d_id
      JOIN courses AS c ON i.i_id = c.c_instructorId
      WHERE i.i_id = ?
      GROUP BY i.i_id, d.d_dept_name;
    `;

  dbConfig.query(query, [parsedInstructorId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found.',
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      message: 'Instructor profile fetched successfully.',
      data: results[0],
    });
  });
});
