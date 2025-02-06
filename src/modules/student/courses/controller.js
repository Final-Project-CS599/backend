import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getCoursesByStudentId = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT 
      c.*,
      GROUP_CONCAT(DISTINCT ta.ta_grade) as assignment_grades,
      GROUP_CONCAT(DISTINCT te.tExam_examGrade) as exam_grades
    FROM courses c
    INNER JOIN enrollment e ON c.c_id = e.e_courseId
    LEFT JOIN takes_assignment ta ON ta.ta_student_id = e.e_studentId 
    LEFT JOIN takesExam te ON te.tExam_studentId = e.e_studentId 
    WHERE e.e_studentId = ?
    GROUP BY c.c_id;
  `;

  dbConfig.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'No courses found for this student', data: [] });
    }

    // Process the results to calculate final grades
    const processedResults = results.map((course) => {
      // Convert comma-separated grades to arrays and filter out null values
      const assignmentGrades = course.assignment_grades
        ? course.assignment_grades
            .split(',')
            .map(Number)
            .filter((grade) => !isNaN(grade))
        : [];

      const examGrades = course.exam_grades
        ? course.exam_grades
            .split(',')
            .map(Number)
            .filter((grade) => !isNaN(grade))
        : [];

      const totalExamGrade = examGrades.length
        ? examGrades.reduce((sum, grade) => sum + grade, 0)
        : 0;

      const totalAssignmentGrade = assignmentGrades.length
        ? assignmentGrades.reduce((sum, grade) => sum + grade, 0)
        : 0;

      const finalGrade = totalAssignmentGrade + totalExamGrade;

      return {
        ...course,
        assignment_grades: assignmentGrades,
        exam_grades: examGrades,
        final_grade: finalGrade,
      };
    });

    res.status(200).json({
      message: 'Courses retrieved successfully',
      data: processedResults,
    });
  });
});

export const enrollInCourse = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.body.id;

  console.log('studentId:', studentId);
  console.log('courseId:', courseId);

  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'Student ID and Course ID are required' });
  }

  const query = `
    INSERT INTO enrollment (e_studentId, e_courseId)
    VALUES (?, ?)
  `;

  dbConfig.query(query, [studentId, courseId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'Enrolled successfully' });
  });
});

export const searchCourses = asyncHandler(async (req, res) => {
  const { q } = req.query; // Search query

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const query = `
    SELECT * 
    FROM courses 
    WHERE c_name LIKE ? OR c_description LIKE ?;
  `;

  dbConfig.query(query, [`%${q}%`, `%${q}%`], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'No courses found', data: [] });
    }

    res.status(200).json(results);
  });
});

export const recommendCourses = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Step 1: Try to fetch recommended courses excluding enrolled courses
  const query = `
    SELECT c.* 
    FROM courses c
    WHERE c.c_id NOT IN (
      SELECT e.e_courseId 
      FROM enrollment e 
      WHERE e.e_studentId = ?
    )
    ORDER BY RAND()
    LIMIT 6;
  `;

  dbConfig.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Step 2: If no recommended courses are found, fetch random courses
    if (results.length === 0) {
      const fallbackQuery = `
        SELECT * 
        FROM courses 
        ORDER BY RAND() 
        LIMIT 6;
      `;

      dbConfig.query(fallbackQuery, (fallbackErr, fallbackResults) => {
        if (fallbackErr) {
          console.error('Error executing fallback query:', fallbackErr);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (fallbackResults.length === 0) {
          return res.status(200).json({ message: 'No courses found', data: [] });
        }

        res.status(200).json(fallbackResults);
      });
    } else {
      res.status(200).json(results);
    }
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  // Query to fetch course details along with associated media
  const query = `
    SELECT 
      courses.*, 
      media.m_id AS media_id, 
      media.m_title AS media_title, 
      media.m_description AS media_description, 
      media.m_link AS media_link, 
      media.m_courseId AS media_course_id
    FROM courses
    LEFT JOIN media ON courses.c_id = media.m_courseId
    WHERE courses.c_id = ?
  `;

  dbConfig.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Group the results to combine course details with associated media
    const courseDetails = {
      ...results[0], // Spread the course details
      media: results
        .filter((row) => row.media_id !== null) // Filter out rows without media
        .map((row) => ({
          id: row.media_id,
          title: row.media_title,
          description: row.media_description,
          link: row.media_link,
          courseId: row.media_course_id,
        })),
    };

    // Remove media-related fields from the course details
    delete courseDetails.media_id;
    delete courseDetails.media_title;
    delete courseDetails.media_description;
    delete courseDetails.media_link;
    delete courseDetails.media_course_id;

    res.status(200).json(courseDetails);
  });
});
export const storePaymentData = async (req, res) => {
  const studentId = req.user.id;
  const { course_id } = req.body; // Assuming course_id is sent in the request body

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  if (!course_id) {
    return res.status(400).json({ success: false, message: 'Course ID is required' });
  }

  const filePath = `uploads/student/${req.file.filename}`;

  // Check if the student exists
  const checkStudentQuery = 'SELECT s_id FROM student WHERE s_id = ?';
  const [studentExists] = await dbConfig.promise().query(checkStudentQuery, [studentId]);

  if (studentExists.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID: Student does not exist',
    });
  }

  // Check if the course exists
  const checkCourseQuery = 'SELECT c_id FROM courses WHERE c_id = ?';
  const [courseExists] = await dbConfig.promise().query(checkCourseQuery, [course_id]);

  if (courseExists.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID: Course does not exist',
    });
  }

  try {
    // Insert payment data into the payment table
    const insertPaymentQuery = `
      INSERT INTO payment (img, initiation_date, student_id, admin_nid)
      VALUES (?, NOW(), ?, NULL)
    `;
    const [paymentResult] = await dbConfig
      .promise()
      .query(insertPaymentQuery, [filePath, studentId]);

    // Insert into extra_payment table to link payment to course
    const insertExtraPaymentQuery = `
      INSERT INTO extra_payment (student_id, course_id)
      VALUES (?, ?)
    `;
    await dbConfig.promise().query(insertExtraPaymentQuery, [studentId, course_id]);

    return res.status(200).json({
      success: true,
      message: 'Payment file uploaded and linked to course successfully',
      filePath,
      course_id,
    });
  } catch (error) {
    console.error('Error storing payment data:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while storing payment data',
    });
  }
};
