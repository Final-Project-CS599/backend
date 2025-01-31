import { Router } from "express";
import { findStudentById, searchStudents, updateStudentById, viewStudentAcademicCourses, viewStudentExtraCourses } from "./editStudent.controller.js";
import { validateSearchStudents, validateUpdateStudents } from "./editStudent.Validation.js";
import { validate } from '../../../middleware/validate.js';
import { verifyToken } from "../../../middleware/auth.js";




const editStudentsRouter = Router()
editStudentsRouter
    .route('/')
    .get(verifyToken, validateSearchStudents, validate, searchStudents)
editStudentsRouter
    .route('/:id')
    .get(verifyToken, findStudentById)
    .patch(verifyToken, validateUpdateStudents, validate, updateStudentById) 
editStudentsRouter
    .route('/:id/academicCourses')    
    .get(verifyToken, viewStudentAcademicCourses)
editStudentsRouter
    .route('/:id/extraCourses') 
    .get(verifyToken, viewStudentExtraCourses)  

export default editStudentsRouter