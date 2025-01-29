import { Router } from "express";
import { addDepartment, getAllDepartments } from "./department.controller.js";


const departmentsRouter = Router()
departmentsRouter
    .route('/')
    .get(getAllDepartments)
    .post(addDepartment)



export default departmentsRouter