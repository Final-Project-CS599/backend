import { Router } from "express";
import login from "../auth/service/login/login.service.js";
import * as forgotPassword from "../auth/service/forgotPassword.service.js";
import * as validators from './auth.validation.js';
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();

router.post('/login' ,validation(validators.loginValidationSchema) ,login);

export default router;

