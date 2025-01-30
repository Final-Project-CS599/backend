import { Router } from "express";
import { findStudentById, searchStudents, updateStudentById, viewStudentAcademicCourses, viewStudentExtraCourses } from "./editStudent.controller.js";



const editStudentsRouter = Router()
editStudentsRouter
    .route('/')
    .get(searchStudents)
editStudentsRouter
    .route('/:id')
    .get(findStudentById)
    .patch(updateStudentById)
    .get(viewStudentAcademicCourses)
    .get(viewStudentExtraCourses)   

export default editStudentsRouter