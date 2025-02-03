import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import {
  enrollInCourse,
  getCourseById,
  getCoursesByStudentId,
  recommendCourses,
  searchCourses,
} from './controller.js';

const router = express.Router();

router.get('/courses', verifyToken, getCoursesByStudentId);
router.post('/courses/enroll', verifyToken, enrollInCourse);
router.get('/courses/search', verifyToken, searchCourses);
router.get('/courses/recommend', verifyToken, recommendCourses);
router.get('/courses/:id', verifyToken, getCourseById);

export default router;
