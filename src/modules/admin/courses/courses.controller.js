import { Router } from 'express';
import * as validators from './courses.validation.js';
import { validation } from '../../../middleware/validation.middleware.js';
import * as coursesServices from './service/courses.service.js';
import * as academicServices from './service/academic.service.js';
import * as extraServices from './service/extraCourse.service.js';
import * as enrollStudent from '../../student/courses/controller.js';
import * as paymentService from './service/payment.service.js';
import getAllDepartment from './service/getDepartment.service.js';
import { verifyToken } from '../../../middleware/auth.js';

const router = Router();

// Courses

router.get('/getAllCourses', coursesServices.getAllCourses);
// router.delete('/deletedCourse', validation(validators.deletedCourse), deletedCourses);

// router.delete('/deletedCourse',
//   validation(validators.deletedCourse),
//   coursesServices.deletedCourses
// );
//
// Academic
router.post('/addAcademic', verifyToken, academicServices.addAcademic);
router.patch('/updateAcademic', verifyToken ,academicServices.updateAcademic);
router.get('/getAllCoursesAcademic', verifyToken , academicServices.getAllCoursesAcademic);

// Department
router.get('/getAllDepartment', getAllDepartment);

//Extra
router.post('/addExtra', verifyToken, extraServices.addExtra);
router.patch('/updateExtra', verifyToken,extraServices.updateExtra);
router.get('/getAllCoursesExtra', verifyToken, extraServices.getAllCoursesExtra);


//payment
router.post('/approvePayment', verifyToken, enrollStudent.enrollInCourse);
router.get('/getPayment', paymentService.getPayments);
router.get('/getExtraCourse/:id', extraServices.getCourseExtra);
router.get('/getAcademicCourse/:id', academicServices.getCourseAcademic);

export default router;
