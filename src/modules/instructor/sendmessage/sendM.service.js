import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { successResponse } from '../../../utils/response/success.response.js';

export const sendMsg = (req, res, next) => {
  const { m_message, role, reciever } = req.body;

  let m_reciever;
  let m_sender;
  let m_student_id;
  let m_instructor_id;

  // Validate required fields first
  if (!role || !m_message || !reciever || !req.user?.id) {
    console.log('Missing fields:', {
      role: !!role,
      message: !!m_message,
      reciever: !!reciever,
      userId: !!req.user?.id,
    });
    return res.status(400).json({
      message: 'All fields are required',
      missing: {
        role: !role,
        message: !m_message,
        reciever: !reciever,
        userId: !req.user?.id,
      },
    });
  }

  if (role === 'student') {
    m_student_id = req.user.id; // sender
    m_instructor_id = reciever; // receiver
    m_reciever = 'instructor'; // Fix: Remove comma operator
    m_sender = 'student'; // Fix: Separate assignment
  } else if (role === 'instructor') {
    m_student_id = reciever; // receiver
    m_instructor_id = req.user.id; // sender
    m_reciever = 'student'; // Fix: Remove comma operator
    m_sender = 'instructor'; // Fix: Separate assignment
  } else {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  // Debug log after assignments
  console.log('Assigned values:', {
    m_student_id,
    m_instructor_id,
    m_message,
    m_sender,
    m_reciever,
  });

  // Validate IDs and message one more time
  if (!m_student_id || !m_instructor_id || !m_message) {
    console.log('Missing required fields after assignment:', {
      m_student_id: !!m_student_id,
      m_instructor_id: !!m_instructor_id,
      m_message: !!m_message,
    });
    return res.status(400).json({
      message: 'Missing required fields after assignment',
      missing: {
        m_student_id: !m_student_id,
        m_instructor_id: !m_instructor_id,
        m_message: !m_message,
      },
    });
  }

  dbConfig.execute(
    `INSERT INTO message (m_student_id, m_instructor_id, m_message, m_sender, m_reciever) 
       VALUES (?, ?, ?, ?, ?)`,
    [m_student_id, m_instructor_id, m_message, m_sender, m_reciever],
    (err, result) => {
      if (err) {
        console.error('Failed to send message:', err);
        return res.status(500).json({ message: 'Failed to send message', error: err.message });
      }
      return res.status(200).json({ message: 'Support message sent successfully' });
    }
  );
};

export const viewMessagesInstructor = (req, res, next) => {
  const m_instructor_id = req.user.id;
  console.log('Received body:', req.body);

  // First get all messages
  dbConfig.execute(
    `SELECT message.*, student.s_first_name AS student_first_name, student.s_last_name AS student_last_name, student.s_email AS student_email, student.s_id AS student_id
       FROM message 
       INNER JOIN student ON message.m_student_id = student.s_id 
       WHERE message.m_instructor_id = ?`,
    [m_instructor_id],
    async (err, results) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: 'Failed to retrieve messages', error: err.message });
      }
      results = JSON.parse(JSON.stringify(results));
      for (let i = 0; i < results.length; i++) {
        results[i].m_sender == 'instructor'
          ? (results[i].type = 'sender')
          : (results[i].type = 'reciever');
        delete results[i].m_sender;
        delete results[i].m_reciever;
      }
      console.log(results);
      return res.status(200).json({ messages: results });
    }
  );
};

export const viewMessageStudent = (req, res, next) => {
  const m_student_id = req.user.id;
  console.log('Received body:', req.body);

  dbConfig.execute(
    `SELECT message.*, Instructors.i_firstName, Instructors.i_lastName, Instructors.i_email  
     FROM message 
     INNER JOIN Instructors ON message.m_instructor_id = Instructors.i_id 
     WHERE message.m_student_id = ?`,
    [m_student_id],
    (err, results) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: 'Failed to retrieve messages', error: err.message });
      }

      // Convert results to a plain object (if necessary)
      results = JSON.parse(JSON.stringify(results));

      // Process each message to add a 'type' field and remove unnecessary fields
      for (let i = 0; i < results.length; i++) {
        results[i].m_sender === 'student'
          ? (results[i].type = 'sender')
          : (results[i].type = 'receiver');

        // Remove the m_sender and m_reciever fields from the response
        delete results[i].m_sender;
        delete results[i].m_reciever;
      }

      // Send the processed messages back to the client
      return res.status(200).json({ messages: results });
    }
  );
};

export const searchByRoleAndName = asyncHandler(async (req, res, next) => {
  const { role, name } = req.body;

  // Validate role
  if (!role || !['student', 'instructor'].includes(role.toLowerCase())) {
    return next(
      new Error('Invalid role specified. Must be either "student" or "instructor"', { cause: 400 })
    );
  }

  // Validate name (optional)
  if (!name) {
    return next(new Error('Name query is required', { cause: 400 }));
  }

  // SQL query to select only first_name and id with name filtering
  const studentQuery = `SELECT s_id, s_first_name FROM student WHERE s_first_name LIKE ?`;
  const instructorQuery = `SELECT i_id, i_first_name FROM instructors WHERE i_first_name LIKE ?`;

  const query = role === 'student' ? instructorQuery : studentQuery;
  const searchTerm = `%${name}%`; // Add wildcards for partial matching

  dbConfig.execute(query, [searchTerm], (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return next(new Error(`Failed to fetch ${role}s`, { cause: 500 }, err));
    }

    return successResponse({
      res,
      message: `${role}s fetched successfully`,
      status: 200,
      data: results,
    });
  });
});

export const deleteMessageInstructor = (req, res, next) => {
  const m_instructor_id = req.user.id;
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({ message: 'Message ID is required' });
  }

  const query = `DELETE FROM message WHERE m_id = ? AND m_instructor_id = ?`;

  dbConfig.execute(query, [messageId, m_instructor_id], (err, results) => {
    if (err) {
      console.error('Error deleting message:', err);
      return res.status(500).json({ message: 'Failed to delete message', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Message not found or you don't have permission to delete it" });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  });
};

export const deleteMessageStudent = (req, res, next) => {
  const m_student_id = req.user.id;
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({ message: 'Message ID is required' });
  }

  const query = `DELETE FROM message WHERE m_id = ? AND m_student_id = ?`;

  dbConfig.execute(query, [messageId, m_student_id], (err, results) => {
    if (err) {
      console.error('Error deleting message:', err);
      return res.status(500).json({ message: 'Failed to delete message', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Message not found or you don't have permission to delete it" });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  });
};
