import bcrypt from 'bcrypt';
import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import Joi from 'joi';

// Schema for Joi validation
const schema = Joi.object({
  phoneNumbers: Joi.array().items(Joi.string().min(1).trim()).optional(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-zA-Z0-9]/)
    .optional(),
});

export const updateInstructorProfile2 = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const { phoneNumbers, password } = req.body;

  // Validate request body
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Authorization check
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'You are not authorized to update this profile' });
  }

  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  dbConfig.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Failed to update profile' });
    }

    if (hashedPassword) {
      const updateInstructorQuery = `
        UPDATE Instructors 
        SET i_password = COALESCE(?, i_password) 
        WHERE i_id = ?`;

      dbConfig.query(updateInstructorQuery, [hashedPassword, id], (err, results) => {
        if (err) {
          return dbConfig.rollback(() => {
            console.error('Error updating instructor:', err);
            return res.status(500).json({ message: 'Failed to update profile' });
          });
        }
      });
    }

    if (phoneNumbers && phoneNumbers.length > 0) {
      const deletePhoneQuery = 'DELETE FROM InstructorsPhone WHERE i_instructorId = ?';
      dbConfig.query(deletePhoneQuery, [id], (err, results) => {
        if (err) {
          return dbConfig.rollback(() => {
            console.error('Error deleting phone numbers:', err);
            return res.status(500).json({ message: 'Failed to update profile' });
          });
        }

        const insertPhoneQuery =
          'INSERT INTO InstructorsPhone (i_instructorId, p_instructorPhone) VALUES ?';

        const phoneValues = phoneNumbers.map((phone) => [id, phone]);
        dbConfig.query(insertPhoneQuery, [phoneValues], (err, results) => {
          if (err) {
            return dbConfig.rollback(() => {
              console.error('Error inserting phone numbers:', err);
              return res.status(500).json({ message: 'Failed to update profile' });
            });
          }

          dbConfig.commit((err) => {
            if (err) {
              return dbConfig.rollback(() => {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ message: 'Failed to update profile' });
              });
            }
          });
        });
      });
    } else {
      console.log('No phone numbers to update');
    }

    if (hashedPassword || phoneNumbers?.length > 0) {
      return res.status(200).json({ message: 'Profile updated successfully!' });
    } else {
      return res.status(400).json({ message: 'No updates done!' });
    }
  });
});

export const viewInstructorProfile = async (req, res, next) => {
  try {
    const instructor_id = req.user.id;

    // Query to get instructor details
    dbConfig.execute(
      `SELECT i_firstName, i_lastName, i_email FROM Instructors WHERE i_id = ?`,
      [instructor_id],
      (err, instructorResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (instructorResults.length === 0) {
          return res.status(404).json({ message: 'This profile does not exist' });
        }

        const { i_firstName, i_lastName, i_email } = instructorResults[0];

        function generateUserName(firstName, lastName) {
          if (!firstName || !lastName) {
            throw new Error('Both firstName and lastName are required.');
          }
          return `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}`;
        }

        const userName = generateUserName(i_firstName, i_lastName);

        // Query to get phone numbers
        dbConfig.execute(
          `SELECT p_instructorPhone FROM InstructorsPhone WHERE i_instructorId = ?`,
          [instructor_id],
          (phoneErr, phoneResults) => {
            if (phoneErr) {
              console.error('Database error:', phoneErr);
              return res.status(500).json({ message: 'Database error', error: phoneErr });
            }

            const phoneNumbers = phoneResults.map((row) => row.p_instructorPhone);

            return res.status(200).json({
              email: i_email,
              userName: userName,
              phoneNumbers: phoneNumbers,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
