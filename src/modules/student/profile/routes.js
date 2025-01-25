import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { updateStudentProfile } from './controller.js';
import { validate } from '../../../middleware V2/validate.js';
import { updateStudentProfileValidation } from '../../../validation/student/updateStudentProfile.js';

const router = express.Router();

router.put(
  '/:id/updateProfile',
  verifyToken,
  updateStudentProfileValidation,
  validate,
  updateStudentProfile
);

export default router;
