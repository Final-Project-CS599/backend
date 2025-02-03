import joi from 'joi';
import { generalFieldsValidation } from '../../../middleware/validation.middleware.js';



export const defaultSuperAdminValidationSchema = joi.object().keys({
    nationalID : generalFieldsValidation.nationalID.required(),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone,
    'accept-language': generalFieldsValidation.acceptLanguage
}).options({allowUnknown: false}).required();



export const addAdminValidationSchema = joi.object().keys({
    adminNationalID : generalFieldsValidation.nationalID.required(),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    sAdminNationalID: generalFieldsValidation.nationalID.required(),
    email: generalFieldsValidation.email.required(),
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone,
    adminRole:  generalFieldsValidation.userName.required().messages({
        'string.empty': 'adminRole is required',
    }), // min 2 and max 50 as length
    password: generalFieldsValidation.passwordAddUsers.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addInstructorValidationSchema = joi.object().keys({
    admin_nationalID:generalFieldsValidation.nationalID.required(),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    email: generalFieldsValidation.email.required(),
    password: generalFieldsValidation.passwordAddUsers.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    
    // phones: generalFieldsValidation.phone.required(),
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone,
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addStudentValidationSchema = joi.object().keys({
    admin_nationalID:generalFieldsValidation.nationalID.required(),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    middleName: generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    password: generalFieldsValidation.passwordAddUsers.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    DOB: generalFieldsValidation.DOB,
    email: generalFieldsValidation.email.required(),
    gander: generalFieldsValidation.gander.required(),
    numberNational: generalFieldsValidation.nationalID.required(),
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone.optional(),
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



