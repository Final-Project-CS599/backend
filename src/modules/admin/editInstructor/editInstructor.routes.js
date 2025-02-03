import { Router } from "express";
import { findInstructorById, searchInstructors, updateInstructorById, viewInstructorAcademicCourses, viewInstructorExtraCourses } from "./editInstructor.controller.js";
import { validate } from '../../../middleware/validate.js';
import { validateSearchInstructors, validateUpdateInstructor } from "./editInstructor.Validation.js";
import { verifyToken } from "../../../middleware/auth.js";


const editinstructorsRouter = Router()
editinstructorsRouter
    .route('/')
    .get(verifyToken, validateSearchInstructors, validate, searchInstructors)
editinstructorsRouter
    .route('/:id')
    .get(verifyToken, findInstructorById)
    .patch(verifyToken, validateUpdateInstructor, validate, updateInstructorById)
editinstructorsRouter
    .route('/:id/academicCourses')    
    .get(verifyToken, viewInstructorAcademicCourses)
editinstructorsRouter
    .route('/:id/extraCourses') 
    .get(verifyToken, viewInstructorExtraCourses)   

export default editinstructorsRouter