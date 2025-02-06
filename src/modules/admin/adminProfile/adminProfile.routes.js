import { Router } from "express";
import { editProfile, viewProfile } from "./adminProfile.controller.js";
import { validate } from '../../../middleware/validate.js';
import { validateEditProfile } from "./adminProfile.validation.js";
import { verifyToken } from "../../../middleware/auth.js";



const adminProfileRouter = Router()
adminProfileRouter
    .route('/')
    .get(verifyToken, viewProfile)
    .patch(verifyToken, validateEditProfile, validate, editProfile)

export default adminProfileRouter