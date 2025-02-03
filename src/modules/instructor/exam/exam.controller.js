import { Router } from 'express';
import * as registrationService from './exam.service.js';
import { verifyToken } from '../../../middleware/auth.js';

const router = Router();

router.post('/add', verifyToken, registrationService.addExam);
router.patch('/edit/:examId', verifyToken, registrationService.editExam);
router.get('/view', verifyToken, verifyToken, registrationService.getExam);
router.get('/view/:examId', verifyToken, registrationService.getExamById);
router.delete('/delete/:examId', registrationService.deleteExam);
export default router;
