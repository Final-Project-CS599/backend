import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { updateInstructorProfile } from './ProfInst.services.js';
import { validate } from '../../../middleware V2/validate.js';
import { updateInstructorProfileValidation } from '../../../validation/instructor/updateInstructorProfile.js';

const router = express.Router();

router.put(
  '/:id/updateProfile',
  verifyToken,
  updateInstructorProfileValidation,
  validate,
  updateInstructorProfile
);

export default router;
