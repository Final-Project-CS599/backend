import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { updateInstructorProfile2 , viewInstructorProfile} from './ProfInst.services.js';
import { validateWithSchema} from '../../../middleware/validateInst.middleware.js';
import { updateInstructorProfileValidation } from '../../../validation/instructor/updateInstructorProfile.js';
const router=express.Router();
router.put(
  '/updateProfile',
  verifyToken,
  validateWithSchema(updateInstructorProfileValidation.body), // Pass the schema here
  updateInstructorProfile2
);
router.get('/viewProfile',verifyToken,viewInstructorProfile)

export default router;
