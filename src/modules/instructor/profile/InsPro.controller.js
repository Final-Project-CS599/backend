import express from 'express';
import { validate } from '../../../middleware/validate.js';
import * as ProfInstServices from './ProfInst.services.js';
import { updateInstructorProfileValidation } from '../../../validation/instructor/updateInstructorProfile.js';
import { verifyToken } from '../../../middleware/auth.js';
const router = express.Router();

router.get('/viewProfile', verifyToken, ProfInstServices.viewInstructorProfile);

router.patch('/updateProfile', verifyToken, ProfInstServices.updateInstructorProfile2);

export default router;
