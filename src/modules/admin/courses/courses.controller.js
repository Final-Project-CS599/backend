import { Router } from 'express';
import * as validators from './courses.validation.js';
import { validation } from '../../../middleware/validation.middleware.js';
import * as coursesServices from './service/courses.service.js';
import * as academicServices from './service/academic.service.js';
import * as extraServices from './service/extraCourse.service.js';
import * as paymentService from '../../student/courses/controller.js';
import getAllDepartment from './service/getDepartment.service.js';
import { verifyToken } from '../../../middleware/auth.js';

const router = Router();

// Courses

router.patch('/updateCourses', validation(validators.updateCourses), coursesServices.updateCourses);
router.get('/getAllCourses', coursesServices.getAllCourses);
router.delete(
  '/deletedCourse',
  validation(validators.deletedCourse),
  coursesServices.deletedCourses
);
//
// Academic
router.post('/addAcademic', verifyToken, academicServices.addAcademic);
router.patch('/updateAcademic', academicServices.updateAcademic);
router.get('/getAllCoursesAcademic', academicServices.getAllCoursesAcademic);

// Department
router.get('/getAllDepartment', getAllDepartment);

//Extra
router.post('/addExtra', extraServices.addExtra);
router.patch('/updateExtra', extraServices.updateExtra);
router.get('/getAllCoursesExtra', extraServices.getAllCoursesExtra);

router.post('/approvePayment', verifyToken, paymentService.enrollInCourse);

export default router;
