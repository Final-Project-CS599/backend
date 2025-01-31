import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { editProfile } from './controller.js';
import { validate } from '../../../middleware/validate.js';
import { updateStudentProfileValidation } from '../../../validation/student/updateStudentProfile.js';

const router = express.Router();

router.put('/updateProfile', verifyToken, updateStudentProfileValidation, validate, editProfile);

export default router;
