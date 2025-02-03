import express from 'express';
import { studentAssignment, submitAssignment } from './assign.controller.js';
import { verifyToken } from '../../../middleware/auth.js';
const router = express.Router();

router.get('/assignment/view/:course_id', studentAssignment);
router.post('/submitassignment', verifyToken, submitAssignment);

export default router;
