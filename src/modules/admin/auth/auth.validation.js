import joi from 'joi';
import { generalFieldsValidation } from '../../../middleware/validation.middleware.js';



export const loginValidationSchema = joi.object().keys({
    email: generalFieldsValidation.email.required(),
    password: generalFieldsValidation.password.required(),
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();


export const forgetPasswordValidationSchema = joi.object().keys({
    email: generalFieldsValidation.email.required(),
}).options({allowUnknown: false}).required();


export const verifyCodeValidationSchema = joi.object().keys({
    code: generalFieldsValidation.code.required(),
}).options({allowUnknown: false}).required();


export const resetPasswordValidationSchema = joi.object().keys({
    email: generalFieldsValidation.email.required(),
    newPassword: generalFieldsValidation.password.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('newPassword')).required(),
}).options({allowUnknown: false}).required();



