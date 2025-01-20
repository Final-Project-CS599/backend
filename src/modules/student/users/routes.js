import { Router } from 'express';
import { getAllAdmins, getAllInstructors, getAllStudents } from './controller.js';

const router = Router();

router.get('/students', getAllStudents);
router.get('/instructors', getAllInstructors);
router.get('/admins', getAllAdmins);

export default router;
