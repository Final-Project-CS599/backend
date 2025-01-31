import { asyncHandler } from '../../../middleware/asyncHandler.js';
import dbConfig from '../../../DB/connection.js';

// Controller for sending a message to the help desk
export const sendMessageToHelpDesk = asyncHandler(async (req, res) => {
  const { title, description, email } = req.body; // Extract data from the request body
  const studentId = req.user.id; // Get the student ID from the authenticated user

  // Insert the message into the helpDesk table
  const query = `
    INSERT INTO helpDesk (hd_title, hd_description, hd_email, hd_studentId)
    VALUES (?, ?, ?, ?)
  `;
  const values = [title, description, email, studentId]; // Assuming instructor ID is 1 for now

  dbConfig.query(query, values, (err, results) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ message: 'Failed to send message' });
    }

    // Include the sent message in the response
    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        id: results.insertId,
        title: title,
        description: description,
        email: email,
        studentId: studentId,
      },
    });
  });
});

// Controller for retrieving student messages from the help desk
export const getStudentMessages = asyncHandler(async (req, res) => {
  const studentId = req.user.id; // Get the student ID from the authenticated user
  // Retrieve messages for the student
  const query = `
    SELECT hd_id, hd_title, hd_description, hd_status, hd_type, hd_email, hd_createdAt, hd_updatedAt
    FROM helpDesk
    WHERE hd_studentId = ?
  `;

  dbConfig.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      return res.status(500).json({ message: 'Failed to retrieve messages' });
    }
    res
      .status(200)
      .json({ message: 'Messages retrieved successfully', data: { messages: results } });
  });
});
