import bcrypt from 'bcrypt';
import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const updateInstructorProfile = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { phoneNumbers, password, birthDate, gender } = req.body; 

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

    if (hashedPassword || birthDate || gender) {
      const updateInstructorQuery = `
        UPDATE student 
        SET 
          i_password = COALESCE(?, i_password), 
          i_DOB = COALESCE(?, i_DOB), 
          i_gender = COALESCE(?, i_gender)
        WHERE i_id = ?`;
      dbConfig.query(
        updateInstructorQuery,
        [hashedPassword, birthDate, gender, id],
        (err, results) => {
          if (err) {
            return dbConfig.rollback(() => {
              console.error('Error updating instructor:', err);
              res.status(500).json({ message: 'Failed to update profile' });
            });
          }

          if (phoneNumbers && phoneNumbers.length > 0) {
            const deletePhoneQuery = 'DELETE FROM InstructorsPhone WHERE p_id = ?';
            dbConfig.query(deletePhoneQuery, [id], (err, results) => {
              if (err) {
                return dbConfig.rollback(() => {
                  console.error('Error deleting phone numbers:', err);
                  res.status(500).json({ message: 'Failed to update profile' });
                });
              }

              const insertPhoneQuery =
                'INSERT INTO InstructorsPhone (p_id, p_instructorPhone) VALUES ?';
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
        }
      );
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
