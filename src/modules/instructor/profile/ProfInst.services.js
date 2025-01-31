import bcrypt from 'bcrypt';
import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import Joi from 'joi';

// Schema for Joi validation
const schema = Joi.object({
  phoneNumbers: Joi.array().items(Joi.string().min(1).trim()).optional(),
  password: Joi.string().min(8).pattern(/[a-zA-Z0-9]/).optional(),
});

export const updateInstructorProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { phoneNumbers, password } = req.body;

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
        UPDATE instructors 
        SET i_password = COALESCE(?, i_password) 
        WHERE i_id = ?`;
      
      dbConfig.query(updateInstructorQuery, [hashedPassword, id], (err, results) => {
        if (err) {
          return dbConfig.rollback(() => {
            console.error('Error updating instructor:', err);
            res.status(500).json({ message: 'Failed to update profile' });
          });
        }

        // Update phone numbers if provided
        if (phoneNumbers && phoneNumbers.length > 0) {
          const deletePhoneQuery = 'DELETE FROM InstructorsPhone WHERE p_id = ?';
          dbConfig.query(deletePhoneQuery, [id], (err, results) => {
            if (err) {
              return dbConfig.rollback(() => {
                console.error('Error deleting phone numbers:', err);
                res.status(500).json({ message: 'Failed to update profile' });
              });
            }

            const insertPhoneQuery = 'INSERT INTO InstructorsPhone (p_id, p_instructorPhone) VALUES ?';
            const phoneValues = phoneNumbers.map((phone) => [id, phone]);
            dbConfig.query(insertPhoneQuery, [phoneValues], (err, results) => {
              if (err) {
                return dbConfig.rollback(() => {
                  console.error('Error inserting phone numbers:', err);
                  res.status(500).json({ message: 'Failed to update profile' });
                });
              }

              dbConfig.commit((err) => {
                if (err) {
                  return dbConfig.rollback(() => {
                    console.error('Error committing transaction:', err);
                    res.status(500).json({ message: 'Failed to update profile' });
                  });
                }

                res.status(200).json({ message: 'Profile updated successfully' });
              });
            });
          });
        } else {
          dbConfig.commit((err) => {
            if (err) {
              return dbConfig.rollback(() => {
                console.error('Error committing transaction:', err);
                res.status(500).json({ message: 'Failed to update profile' });
              });
            }

            res.status(200).json({ message: 'Profile updated successfully' });
          });
        }
      });
    } else {
      if (phoneNumbers && phoneNumbers.length > 0) {
        const deletePhoneQuery = 'DELETE FROM InstructorsPhone WHERE p_id = ?';
        dbConfig.query(deletePhoneQuery, [id], (err, results) => {
          if (err) {
            return dbConfig.rollback(() => {
              console.error('Error deleting phone numbers:', err);
              res.status(500).json({ message: 'Failed to update profile' });
            });
          }

          const insertPhoneQuery = 'INSERT INTO InstructorsPhone (p_id, p_instructorPhone) VALUES ?';
          const phoneValues = phoneNumbers.map((phone) => [id, phone]);
          dbConfig.query(insertPhoneQuery, [phoneValues], (err, results) => {
            if (err) {
              return dbConfig.rollback(() => {
                console.error('Error inserting phone numbers:', err);
                res.status(500).json({ message: 'Failed to update profile' });
              });
            }

            dbConfig.commit((err) => {
              if (err) {
                return dbConfig.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ message: 'Failed to update profile' });
                });
              }

              res.status(200).json({ message: 'Profile updated successfully' });
            });
          });
        });
      } else {
        res.status(200).json({ message: 'No updates performed' });
      }
    }
  });
});
