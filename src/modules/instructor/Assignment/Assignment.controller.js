import { Router } from 'express';
import * as assignmentServiece from './Assignment.serviece.js';
import { verifyToken } from '../../../middleware/auth.js';

const router = Router();

router.post('/add', verifyToken, assignmentServiece.addAssignment);
router.put('/edit/:assinId', verifyToken, assignmentServiece.editAssignment);
router.get('/view', verifyToken, assignmentServiece.getAssignment);
router.get('/view/:assinId', verifyToken, assignmentServiece.getAssignmentById);

router.delete('/delete/:assinId', assignmentServiece.deleteAssignment);
router.get('/searchAssignment', assignmentServiece.searchAssignment);
router.get('/viewStudents', assignmentServiece.getStudentForAssignment);

export default router;
