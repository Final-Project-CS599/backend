import dbConfig from '../../../DB/connection.js';
import bcrypt from 'bcrypt';
import { AppError } from '../../../utils/AppError.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const conn = dbConfig.promise();

const viewProfile = asyncHandler(async (req, res, next) => {
  const { nationalId } = req.params;

  const [rows] = await conn.query(
    `SELECT 
            admin.sAdmin_nationalID, 
            admin.sAdmin_firstName,
            admin.sAdmin_lastName,
            admin.sAdmin_email, 
            admin.sAdmin_role,
            GROUP_CONCAT(adminPhones.p_number) as phones
        FROM superadmin admin
        LEFT JOIN superadminsphone adminPhones 
            ON admin.sAdmin_nationalID = adminPhones.sAdmin_nationalID
        WHERE admin.sAdmin_nationalID = ?
        GROUP BY admin.sAdmin_nationalID`,
    [nationalId]
  );

  if (!rows[0]) return next(new AppError('Admin not found', 404));

  const adminData = {
    nationalId: rows[0].sAdmin_nationalID,
    firstName: rows[0].sAdmin_firstName,
    lastName: rows[0].sAdmin_lastName,
    email: rows[0].sAdmin_email,
    role: rows[0].sAdmin_role,
    primaryPhone: rows[0].phones ? rows[0].phones.split(',')[0] : '',
    secondaryPhone: rows[0].phones ? rows[0].phones.split(',')[1] : '',
  };

  res.json({ message: 'success', adminData });
});

const editProfile = asyncHandler(async (req, res, next) => {

  const { nationalId } = req.params;
  const { primaryPhone, secondaryPhone, newPassword, confirmPassword } = req.body;

  // Update phone numbers
  if (primaryPhone || secondaryPhone) {
    // Fetch existing phone numbers for the user
    const [existingPhones] = await conn.query(
      'SELECT p_id, p_number FROM superAdminsPhone WHERE sAdmin_nationalID = ?',
      [nationalId]
    );

    // Update or insert primary phone
    if (primaryPhone) {
      if (existingPhones[0]) {
        await conn.query(
          'UPDATE superAdminsPhone SET p_number = ? WHERE p_id = ?',
          [primaryPhone, existingPhones[0].p_id]
        );
      } else {
        await conn.query(
          'INSERT INTO superAdminsPhone (p_number, sAdmin_nationalID) VALUES (?, ?)',
          [primaryPhone, nationalId]
        );
      }
    }

    // Update or insert secondary phone
    if (secondaryPhone) {
      if (existingPhones[1]) {
        await conn.query(
          'UPDATE superAdminsPhone SET p_number = ? WHERE p_id = ?',
          [secondaryPhone, existingPhones[1].p_id]
        );
      } else {
        await conn.query(
          'INSERT INTO superAdminsPhone (p_number, sAdmin_nationalID) VALUES (?, ?)',
          [secondaryPhone, nationalId]
        );
      }
    }
  }

  // Update password if newPassword and confirmPassword are provided
  if (newPassword && confirmPassword) {
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
