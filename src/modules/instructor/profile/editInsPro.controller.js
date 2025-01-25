import { Router } from 'express';
import multer from 'multer';
import { viewProfile, updateProfile } from './editProfInst.services.js';

// إعداد الـ storage لمولد الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos'); // حدد المسار الذي سيتم تخزين الملفات فيه
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // تحديد اسم الملف
  }
});

// إعداد الـ middleware لاستخدامه في route
const upload = multer({ storage: storage });

const profileRoutes = Router();

// تعريف الـ routes
profileRoutes.get('/view-profile/:id', viewProfile);
profileRoutes.put('/update-profile/:id', upload.single('profilePicture'), updateProfile);

export default profileRoutes;
