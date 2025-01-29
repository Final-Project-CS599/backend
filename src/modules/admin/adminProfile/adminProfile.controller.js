import dbConfig from "../../../DB/connection.js";
import bcrypt from 'bcrypt';
import { AppError } from "../../../utils V2/AppError.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";


const conn = dbConfig.promise();

const viewProfile = asyncHandler(async (req, res, next) => {
    const { nationalId } = +req.params;

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

    if (!rows[0]) return next(new AppError("Admin not found", 404));

    const adminData = {
        nationalId: rows[0].sAdmin_nationalID,
        firstName: rows[0].sAdmin_firstName,
        lastName: rows[0].sAdmin_lastName,
        email: rows[0].sAdmin_email,
        role: rows[0].sAdmin_role,
        primaryPhone: rows[0].phones ? rows[0].phones.split(',')[0] : '',
        secondaryPhone: rows[0].phones ? rows[0].phones.split(',')[1] : ''
    };

    res.json({ message: "success", adminData })
})


const editProfile = asyncHandler(async (req, res) => {
    const { nationalId } = req.params;
    const { primaryPhone, secondaryPhone } = req.body;

    await conn.beginTransaction();

    const phones = [];
    if (primaryPhone) phones.push(primaryPhone);
    if (secondaryPhone) phones.push(secondaryPhone);

    await conn.query(
        'DELETE FROM superadminsphone WHERE sAdmin_nationalID = ?',
        [nationalId]
    );

    if (phones.length > 0) {
        const newPhones = phones.map(phone => [phone, nationalId]);
        await conn.query(
            'INSERT INTO superadminsphone (p_number, sAdmin_nationalID) VALUES ?',
            [newPhones]
        );
    }

    await conn.commit();
    

    res.status(200).json({ message: "Profile updated successfully" });
})



const updateAdminPassword = asyncHandler(async (req, res, next) => {
    const { nationalId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return next(new AppError("New password and confirm password do not match", 400));
    }

    const [admin] = await conn.query(
        'SELECT sAdmin_password FROM superadmin WHERE sAdmin_nationalID = ?',
        [nationalId]
    );

    if (!admin[0]) {
        return next(new AppError("Admin not found", 404));
    }

    const passwordMatch = await bcrypt.compare(oldPassword, admin[0].sAdmin_password);
    if (!passwordMatch) {
        return next(new AppError("Invalid old password", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await conn.query(
        'UPDATE superadmin SET sAdmin_password = ? WHERE sAdmin_nationalID = ?',
        [hashedPassword, nationalId]
    );

    res.status(200).json({ message: "Password updated successfully" });
});



export {
    viewProfile,
    editProfile
    
}