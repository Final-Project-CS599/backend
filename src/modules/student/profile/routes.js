import express from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import { editProfile, getStudentData } from './controller.js';
import { validate } from '../../../middleware/validate.js';
import { updateStudentProfileValidation } from '../../../validation/student/updateStudentProfile.js';

const router = express.Router();

router.patch('/updateProfile', verifyToken, updateStudentProfileValidation, validate, editProfile);

router.get('/profile', verifyToken, getStudentData);

export default router;
