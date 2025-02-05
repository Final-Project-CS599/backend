import dbConfig from '../../../DB/connection.js';
import bcrypt from 'bcrypt';
import { AppError } from '../../../utils/AppError.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const conn = dbConfig.promise();

const viewProfile = asyncHandler(async (req, res, next) => {
  const nationalId = req.user.id; // Fix destructuring

  const query = `
    SELECT 
      a.sAdmin_nationalID AS nationalId, 
      a.sAdmin_firstName AS firstName,
      a.sAdmin_lastName AS lastName,
      a.sAdmin_email AS email, 
      a.sAdmin_role AS role,
      GROUP_CONCAT(adminPhones.p_number) AS phones
    FROM superAdmin a
    LEFT JOIN superAdminsPhone adminPhones 
      ON a.sAdmin_nationalID = adminPhones.sAdmin_nationalID
    WHERE a.sAdmin_nationalID = ?
    GROUP BY a.sAdmin_nationalID
  `;

  const [admins] = await conn.execute(query, [nationalId]);

  if (!admins.length) {
    return next(new AppError('Admin not found', 404));
  }

  console.log(admins, 'admins'); // Corrected logging

  const phoneNumbers = admins[0].phones ? admins[0].phones.split(',') : [];

  const adminData = {
    ...admins[0],
    primaryPhone: phoneNumbers[0] || '',
    secondaryPhone: phoneNumbers[1] || '',
  };

  res.status(200).json({ message: 'success', adminData });
});


const editProfile = asyncHandler(async (req, res, next) => {
  const nationalId = req.user.id;
  const { primaryPhone, secondaryPhone, newPassword, confirmPassword } = req.body;

  if (newPassword) {  
    if (newPassword !== confirmPassword) {  
      return next(new AppError('Passwords do not match', 400));
    }
  }


  if (primaryPhone || secondaryPhone) {
    const [existingPhones] = await conn.query(
      'SELECT p_id, p_number FROM superAdminsPhone WHERE sAdmin_nationalID = ?',
      [nationalId]
    );

    const upsertPhone = async (phoneNumber, index) => {
      if (phoneNumber) {
        if (existingPhones[index]) {
          await conn.query(
            'UPDATE superAdminsPhone SET p_number = ? WHERE p_id = ?',
            [phoneNumber, existingPhones[index].p_id]
          );
        } else {
          await conn.query(
            'INSERT INTO superAdminsPhone (p_number, sAdmin_nationalID) VALUES (?, ?)',
            [phoneNumber, nationalId]
          );
        }
      }
    };

    await upsertPhone(primaryPhone, 0);
    await upsertPhone(secondaryPhone, 1);
  }

  if (newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await conn.query('UPDATE superAdmin SET sAdmin_password = ? WHERE sAdmin_nationalID = ?', [
      hashedPassword,
      nationalId,
    ]);
  }

  res.status(200).json({ message: 'Profile and password updated successfully' });
});

export { viewProfile, editProfile };
