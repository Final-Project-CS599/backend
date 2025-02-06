import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const sendMsgHelp = (req, res, next) => {
  const instructorsId = req.user.id;
  const { title, description, email } = req.body;
  console.log('Received body:', req.body);

  if (!title || !description || !email || !instructorsId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  dbConfig.execute(
    `INSERT INTO helpDesk (hd_title, hd_description, hd_email, hd_instructorsId) VALUES (?, ?, ?, ?)`,
    [title, description, email, instructorsId],
    (err, result) => {
      if (err) {
        console.error('Failed to send message:', err);
        return res.status(500).json({ message: 'Failed to send message', err: err.message });
      }
      return res.status(200).json({ message: 'Support message sent successfully' });
    }
  );
};

export const getInstructorMessages = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  console.log('Instructor ID:', instructorId);

  const query = `
      SELECT hd_id, hd_title, hd_description, hd_status, hd_type, hd_email, hd_createdAt, hd_updatedAt
      FROM helpDesk
      WHERE hd_instructorsId = ?
    `;

  dbConfig.query(query, [instructorId], (err, results) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      return res.status(500).json({ message: 'Failed to retrieve messages' });
    }
    res
      .status(200)
      .json({ message: 'Messages retrieved successfully', data: { messages: results } });
  });
});
