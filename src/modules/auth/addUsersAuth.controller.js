import { Router } from "express";
import addInstructor from "./service/addInstructors.service.js";
import addStudent from "./service/addStudents.service.js";
import insertDefaultAdmin from './service/defaultAdmin/defaultAdmin.service.js';
import addAdmin from "./service/defaultAdmin/addAdmin.service.js";
import * as validators from './auth.validation.js';
import { validation } from "../../middleware/validation.middleware.js";
import login from "./service/login/login.service.js";



const router = Router();


router.post(`/insertDefaultAdmin` ,validation(validators.signupValidationSchema), insertDefaultAdmin);
router.post('/insertAddAdmin' , validation(validators.addAdminValidationSchema), addAdmin);
router.post('/addInstructor' , validation(validators.addInstructorValidationSchema), addInstructor);
router.post(`/addStudent` ,validation(validators.addStudentValidationSchema) ,addStudent);
router.post('/login' ,validation(validators.loginValidationSchema) ,login);



export default router;

