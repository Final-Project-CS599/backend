import bcrypt from 'bcrypt';
import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const editProfile = asyncHandler(async (req, res) => {
  const studentId = req.user.id; 
  const { primaryPhone, secondaryPhone, password, birthDate, gender } = req.body; 

 
  const phoneNumbers = [];
  if (primaryPhone) phoneNumbers.push(primaryPhone);
  if (secondaryPhone) phoneNumbers.push(secondaryPhone);

  
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
        WHERE s_id = ?`;
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
          if (phoneNumbers.length > 0) {
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

                  // Fetch the updated student data
                  fetchUpdatedStudentData(studentId, res);
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

              // Fetch the updated student data
              fetchUpdatedStudentData(studentId, res);
            });
          }
        }
      );
    } else {
      // If no updates to student table, just update phone numbers
      if (phoneNumbers.length > 0) {
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

              // Fetch the updated student data
              fetchUpdatedStudentData(studentId, res);
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

const fetchUpdatedStudentData = (studentId, res) => {
  const selectStudentQuery = `
    SELECT s.*, GROUP_CONCAT(sp.sp_phone) AS phone_numbers
    FROM student s
    LEFT JOIN student_phone sp ON s.s_id = sp.sp_student_id
    WHERE s.s_id = ?`;

  dbConfig.query(selectStudentQuery, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching updated student data:', err);
      return res.status(500).json({ message: 'Failed to fetch updated profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const fullStudentData = results[0];

    // Process phone numbers
    const phoneNumbers = fullStudentData.phone_numbers
      ? fullStudentData.phone_numbers.split(',')
      : [];

    const studentData = {
      id: fullStudentData.s_id,
      firstName: fullStudentData.s_first_name,
      middleName: fullStudentData.s_middle_name,
      lastName: fullStudentData.s_last_name,
      email: fullStudentData.s_email,
      phoneNumbers: phoneNumbers,
      dateOfBirth: fullStudentData.s_DOB,
      gender: fullStudentData.s_gender,
      department: fullStudentData.d_dept_name,
    };

    res.status(200).json({ message: 'Profile updated successfully', student: studentData });
  });
};

export const getStudentData = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  const selectStudentQuery = `
    SELECT s.*, GROUP_CONCAT(sp.sp_phone) AS phone_numbers
    FROM student s  
    LEFT JOIN student_phone sp ON s.s_id = sp.sp_student_id
    WHERE s.s_id = ?`;

  dbConfig.query(selectStudentQuery, [studentId], (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).json({ message: 'Failed to retrieve data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const fullStudentData = results[0];

    // Process phone numbers
    const phoneNumbers = fullStudentData.phone_numbers
      ? fullStudentData.phone_numbers.split(',')
      : [];

    const studentData = {
      id: fullStudentData.s_id, // Student ID
      firstName: fullStudentData.s_first_name, // First name
      middleName: fullStudentData.s_middle_name, // Middle name
      lastName: fullStudentData.s_last_name, // Last name
      email: fullStudentData.s_email, // Email
      phoneNumbers: phoneNumbers, // Phone numbers
      dateOfBirth: fullStudentData.s_DOB, // Date of birth
      gender: fullStudentData.s_gender, // Gender
      department: fullStudentData.d_dept_name, // Department
    };

    res.status(200).json({ message: 'data retrieved successfully', data: { studentData } });
  });
});
