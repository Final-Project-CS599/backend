import { Router } from "express";
import { editProfile, viewProfile } from "./adminProfile.controller.js";

viewProfile
editProfile

const adminProfileRouter = Router()
adminProfileRouter
    .route('/:nationalId')
    .get(viewProfile)
    .put(editProfile)

export default adminProfileRouter