import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import * as coursesService from './controller.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/student');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/courses', verifyToken, coursesService.getCoursesByStudentId);
router.post('/courses/enroll', verifyToken, coursesService.enrollInCourse);
router.get('/courses/search', verifyToken, coursesService.searchCourses);
router.get('/courses/recommend', verifyToken, coursesService.recommendCourses);
router.post(
  '/courses/addPayment',
  verifyToken,
  upload.single('file'),
  coursesService.storePaymentData
);
router.get('/courses/:id', verifyToken, coursesService.getCourseById);

export default router;
