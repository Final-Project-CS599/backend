import { Router } from "express";
import login from "./service/login.service.js";
import confirmEmail from "./service/confirmEmail.service.js";
import * as forgotPassword from "../auth/service/forgotPassword.service.js";
import * as validators from './auth.validation.js';
import { validation } from "../../../middleware/validation.middleware.js";



const router = Router();

router.post('/login' ,validation(validators.loginValidationSchema) ,login);
router.post("/confirmEmail", confirmEmail);
router.patch('/forgotPassword' , validation(validators.forgetPasswordValidationSchema) ,forgotPassword.forgotPassword);
router.patch('/verifyCode' , validation(validators.verifyCodeValidationSchema),forgotPassword.verifyCode);
router.patch('/resetPassword' , validation(validators.resetPasswordValidationSchema) ,forgotPassword.resetPassword);

export default router;

