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
    // National ID
    adminNationalID : generalFieldsValidation.nationalID.required(),
    // User Name
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // User Name
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // National ID
    sAdminNationalID: generalFieldsValidation.nationalID.required(),
    // Email
    email: generalFieldsValidation.email.required(),
    // Phone
    phone1 : generalFieldsValidation.phone.required(),
    // Phone
    phone2 : generalFieldsValidation.phone,
    // Role 
    adminRole:  generalFieldsValidation.userName.required().messages({
        'string.empty': 'adminRole is required',
    }), // min 2 and max 50 as length
    // Password
    password: generalFieldsValidation.passwordAddUsers.valid(joi.ref('adminNationalID')).required(),
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addInstructorValidationSchema = joi.object().keys({
    // National ID
    admin_nationalID:generalFieldsValidation.nationalID.required(),
    // User Name
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // User Name
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // Email
    email: generalFieldsValidation.email.required(),
    // Password
    password: generalFieldsValidation.passwordAddInstructor.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    // Department
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    // phones
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone,
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addStudentValidationSchema = joi.object().keys({
    // National ID
    admin_nationalID:generalFieldsValidation.nationalID.required(),
    // User Name
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // User Name
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // User Name
    middleName: generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    // National ID
    numberNational: generalFieldsValidation.nationalID.required(),
    // Password
    password: generalFieldsValidation.passwordAddUsers.valid(joi.ref('numberNational')).required(),
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // password: generalFieldsValidation.passwordAddUsers.required(),
    // confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DOB
    DOB: generalFieldsValidation.DOB,
    // Email
    email: generalFieldsValidation.email.required(),
    // gander
    gander: generalFieldsValidation.gander.required(),
    // Department
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    // Phones
    phone1 : generalFieldsValidation.phone.required(),
    phone2 : generalFieldsValidation.phone.optional(),
    // Languages
    'ln': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



