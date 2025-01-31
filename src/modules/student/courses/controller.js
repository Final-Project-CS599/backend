import dbConfig from '../../../DB/connection.js';

export const getCoursesByStudentId = (req, res) => {
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
      SELECT * FROM enrollment 
      WHERE e_studentId = ?
    `;

  dbConfig.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No courses found for this student' });
    }

    res.status(200).json(results);
  });
};
