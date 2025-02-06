import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const addAssignment = async (req, res, next) => {
  try {
    const instructor_id = req.user.id;
    const { title, description, degree, type, link, courseId } = req.body;

    if (!instructor_id || !title || !description || !degree || !type || !link || !courseId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const insertQuery = `INSERT INTO assignment (a_title, a_description, a_degree, a_type, a_link, a_instructor_id, a_courseId, a_publish_date)
                             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    dbConfig.query(
      insertQuery,
      [title, description, degree, type, link, instructor_id, courseId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to execute query',
            error: err.message,
          });
        }
        return res
          .status(201)
          .json({ message: 'Assignment added successfully', assignmentId: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editAssignment = async (req, res, next) => {
  try {
    const { assinId } = req.params;
    const instructor_id = req.user.id;
    const { type, description, title, link, degree } = req.body;

    if (!type || !description || !title || !link || !degree || !instructor_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
            UPDATE assignment
            SET 
                a_title = ?, 
                a_description = ?, 
                a_degree = ?, 
                a_type = ?, 
                a_link = ?
            WHERE a_id = ? AND a_instructor_id = ?
        `;

    dbConfig.query(
      query,
      [title, description, degree, type, link, Number(assinId), instructor_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to execute query',
            error: err.message,
            stack: err.stack,
          });
        } else {
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
          }
          return res.status(200).json({ message: 'Assignment updated successfully' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAssignment = async (req, res, next) => {
  try {
    const instructor_id = req.user.id;
    if (!instructor_id) {
      return res.status(400).json({ message: 'instructor_id is required' });
    }

    dbConfig.execute(
      `SELECT * FROM assignment WHERE a_instructor_id = ?`,
      [instructor_id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to execute query', error: err.message });
        } else {
          if (data.length === 0) {
            return res.status(200).json({
              status: 'success',
              message: 'No assignments found',
              data: [], // Explicitly return an empty array
            });
          }

          // Return data
          return res.status(200).json({
            status: 'success',
            message: 'assignments retrieved successfully',
            data: data,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAssignment = async (req, res, next) => {
  console.log('DELETE request received');

  const { assinId } = req.params;
  console.log('Request body:', req.body);

  dbConfig.execute(`DELETE FROM assignment WHERE a_id = ?`, [assinId], (error, data) => {
    if (error) {
      return res
        .status(500)
        .json({ message: 'Failed to execute query', error: error.message, stack: error.stack });
    } else {
      return res.status(200).json({ message: 'Assignment deleted successfully' });
    }
  });
};

export const searchAssignment = async (req, res, next) => {
  const { assignment } = req.query;
  if (!assignment) {
    return res.status(400).json({ message: 'Search Query is Required' });
  }

  const query = `SELECT * FROM assignment WHERE a_title LIKE ? OR a_type LIKE ?`;

  dbConfig.execute(query, [`%${assignment}%`, `%${assignment}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to execute Query', error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'No Assignment found' });
    }

    return res.status(200).json({
      message: 'Your Assignment search Done',
      courses: data,
    });
  });
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const { assinId } = req.params;
    const query = `SELECT * FROM assignment WHERE a_id = ?`;

    dbConfig.execute(query, [assinId], (error, data) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to execute Query' });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: 'No assignment found' });
      }

      return res.status(200).json({
        message: 'Your assignment search Done',
        assignment: data[0],
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentForAssignment = asyncHandler(async (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  dbConfig.query(
    'SELECT e_studentId FROM enrollment WHERE e_courseId = ?',
    [courseId],
    (err, enrolments) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const studentIds = enrolments.map((row) => row.e_studentId);

      if (studentIds.length === 0) {
        return res.json({ message: 'No students found', data: [] });
      }

      dbConfig.query('SELECT * FROM student WHERE s_id IN (?)', [studentIds], (err, students) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({
          message: 'Your assignment search is done',
          data: students,
        });
      });
    }
  );
});
