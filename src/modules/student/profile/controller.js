import bcrypt from 'bcrypt';
import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const editProfile = asyncHandler(async (req, res) => {
  const studentId = req.user.id; // Get the student ID from the authenticated user
  console.log('studentId:', studentId);
  const { phoneNumbers, password, birthDate, gender } = req.body; // Data to update

  // Hash the password if provided
  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  // Begin a transaction
  dbConfig.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Failed to update profile' });
    }

    // Update student table
    if (hashedPassword || birthDate || gender) {
      const updateStudentQuery = `
        UPDATE student 
        SET 
          s_password = COALESCE(?, s_password), 
          s_DOB = COALESCE(?, s_DOB), 
          s_gender = COALESCE(?, s_gender)
        WHERE s_national_id = ?`;
      dbConfig.query(
        updateStudentQuery,
        [hashedPassword, birthDate, gender, studentId],
        (err, results) => {
          if (err) {
            return dbConfig.rollback(() => {
              console.error('Error updating student:', err);
              res.status(500).json({ message: 'Failed to update profile' });
            });
          }

          // Update phone numbers
          if (phoneNumbers && phoneNumbers.length > 0) {
            const deletePhoneQuery = 'DELETE FROM student_phone WHERE sp_student_id = ?';
            dbConfig.query(deletePhoneQuery, [studentId], (err, results) => {
              if (err) {
                return dbConfig.rollback(() => {
                  console.error('Error deleting phone numbers:', err);
                  res.status(500).json({ message: 'Failed to update profile' });
                });
              }

              const insertPhoneQuery =
                'INSERT INTO student_phone (sp_student_id, sp_phone) VALUES ?';
              const phoneValues = phoneNumbers.map((phone) => [studentId, phone]);
              dbConfig.query(insertPhoneQuery, [phoneValues], (err, results) => {
                if (err) {
                  return dbConfig.rollback(() => {
                    console.error('Error inserting phone numbers:', err);
                    res.status(500).json({ message: 'Failed to update profile' });
                  });
                }

                // Commit the transaction
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
            // Commit the transaction if no phone numbers are provided
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
      // If no updates to student table, just update phone numbers
      if (phoneNumbers && phoneNumbers.length > 0) {
        const deletePhoneQuery = 'DELETE FROM student_phone WHERE sp_student_id = ?';
        dbConfig.query(deletePhoneQuery, [studentId], (err, results) => {
          if (err) {
            return dbConfig.rollback(() => {
              console.error('Error deleting phone numbers:', err);
              res.status(500).json({ message: 'Failed to update profile' });
            });
          }

          const insertPhoneQuery = 'INSERT INTO student_phone (sp_student_id, sp_phone) VALUES ?';
          const phoneValues = phoneNumbers.map((phone) => [studentId, phone]);
          dbConfig.query(insertPhoneQuery, [phoneValues], (err, results) => {
            if (err) {
              return dbConfig.rollback(() => {
                console.error('Error inserting phone numbers:', err);
                res.status(500).json({ message: 'Failed to update profile' });
              });
            }

            // Commit the transaction
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
        // If no updates at all, return success
        res.status(200).json({ message: 'No updates performed' });
      }
    }
  });
});
