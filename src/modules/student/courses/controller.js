import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getCoursesByStudentId = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT c.* 
    FROM courses c
    INNER JOIN enrollment e ON c.c_id = e.e_courseId
    WHERE e.e_studentId = ?;
  `;

  dbConfig.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'No courses found for this student', data: [] });
    }

    res.status(200).json(results);
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

export const storePaymentData = asyncHandler(async (req, res) => {
  const { student_id, admin_nid } = req.body;
  if (!req.file || !student_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const img = req.file.filename;
  const initiation_date = new Date().toISOString().split('T')[0];
  const query = `INSERT INTO payment (img, initiation_date, student_id, admin_nid) VALUES (?, ?, ?, ?)`;
  const values = [img, initiation_date, student_id, admin_nid || null];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting payment record: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Payment record added successfully', id: result.insertId });
  });
});
