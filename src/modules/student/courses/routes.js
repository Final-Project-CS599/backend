import express from 'express';
import { verifyToken } from '../../../middleware/auth.js'; // Authentication middleware
import { getCoursesByStudentId } from './controller.js';

const router = express.Router();

router.get(
  '/courses',
  verifyToken, // Ensure the user is authenticated
  getCoursesByStudentId // Controller to handle the request
);

export default router;
