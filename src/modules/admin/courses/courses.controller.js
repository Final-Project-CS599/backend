import { Router } from 'express';
import { verifyToken } from '../../../middleware/auth.js';
import * as academicServices from './service/academic.service.js';
import * as coursesServices from './service/courses.service.js';
import * as extraServices from './service/extraCourse.service.js';
import getAllDepartment from './service/getDepartment.service.js';
import * as paymentService from './service/payment.service.js';

const router = Router();

// Courses

router.get('/getAllCourses', coursesServices.getAllCourses);
router.delete('/deleteCourse', coursesServices.deletedCourse);

// Academic
router.post('/addAcademic', verifyToken, academicServices.addAcademic);
router.patch('/updateAcademic/:id', verifyToken, academicServices.updateAcademic);
router.get('/getAllCoursesAcademic', verifyToken, academicServices.getAllCoursesAcademic);

// Department
router.get('/getAllDepartment', getAllDepartment);

//Extra
router.post('/addExtra', verifyToken, extraServices.addExtra);
router.patch('/updateExtra/:id', verifyToken, extraServices.updateExtra);
router.get('/getAllCoursesExtra', verifyToken, extraServices.getAllCoursesExtra);

//payment
router.post('/approvePayment', verifyToken, paymentService.approvePayment);
router.delete('/cancelPayment/:id', verifyToken, paymentService.cancelPayment);
router.get('/getPayments', paymentService.getPayments);
router.get('/getExtraCourse/:id', extraServices.getCourseExtra);
router.get('/getAcademicCourse/:id', academicServices.getCourseAcademic);

export default router;
