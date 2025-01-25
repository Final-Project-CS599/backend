import { Router } from 'express';
import {
  getAllAdmins,
  getAllDepartments,
  getAllInstructors,
  getAllStudents,
} from './controller.js';

const router = Router();

router.get('/students', getAllStudents);
router.get('/instructors', getAllInstructors);
router.get('/admins', getAllAdmins);
router.get('/department', getAllDepartments);

export default router;
