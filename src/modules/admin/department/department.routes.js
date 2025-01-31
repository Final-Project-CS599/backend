import { Router } from "express";
import { addDepartment, getAllDepartments } from "./department.controller.js";
import { validateAddDepartment } from "./department.Validation.js";
import { validate } from "../../../middleware/validate.js";
import { verifyToken } from "../../../middleware/auth.js";


const departmentsRouter = Router()
departmentsRouter
    .route('/')
    .get(verifyToken, getAllDepartments)
    .post(verifyToken, validateAddDepartment, validate, addDepartment)



export default departmentsRouter