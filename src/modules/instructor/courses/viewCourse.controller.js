import { verifyToken } from '../../../middleware/auth.js';
import { viewCourseById, viewCoursesWithExtraData, searchCourse } from './viewCourse.serviece.js';
import { Router } from 'express';

const router = Router();

router.get('/viewCoursesWithExtra', verifyToken, viewCoursesWithExtraData);
router.get('/viewCourse/:course_id', verifyToken, viewCourseById);
router.get('/searchCourse', verifyToken, searchCourse);

export default router;
