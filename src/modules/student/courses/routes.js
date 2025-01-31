import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { getCoursesByStudentId } from './controller.js';

const router = express.Router();

router.get('/courses', verifyToken, getCoursesByStudentId);

export default router;
