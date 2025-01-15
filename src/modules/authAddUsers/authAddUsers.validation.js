import joi from 'joi';
import { generalFieldsValidation } from "../../middleware/validation.middleware.js";


export const signupValidationSchema = joi.object().keys({
    nationalID : generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    phones : joi.alternatives().try( generalFieldsValidation.phone, generalFieldsValidation.phoneArray).required().messages({
        'alternatives.match': "Please provide a valid phone number or an array of phone numbers."
    }),
    'accept-language': generalFieldsValidation.acceptLanguage
}).options({allowUnknown: false}).required();



export const addAdminValidationSchema = joi.object().keys({
    adminNationalID : generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    sAdminNationalID: generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    email: generalFieldsValidation.email.required(),
    password: generalFieldsValidation.password.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    adminRole:  generalFieldsValidation.userName.required().messages({
        'string.empty': 'adminRole is required',
    }), // min 2 and max 50 as length
    phones : joi.alternatives().try( generalFieldsValidation.phone, generalFieldsValidation.phoneArray).required().messages({
        'alternatives.match': "Please provide a valid phone number or an array of phone numbers."
    }),
    'accept-language': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addInstructorValidationSchema = joi.object().keys({
    admin_nationalID:generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    email: generalFieldsValidation.email.required(),
    password: generalFieldsValidation.password.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    
    // phones: generalFieldsValidation.phone.required(),
    phones : joi.alternatives().try( generalFieldsValidation.phone, generalFieldsValidation.phoneArray).required().messages({
        'alternatives.match': "Please provide a valid phone number or an array of phone numbers."
    }),
    'accept-language': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



export const addStudentValidationSchema = joi.object().keys({
    admin_nationalID:generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    firstName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    lastName : generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    middleName: generalFieldsValidation.userName.required().messages({
        'string.empty': 'userName is required',
    }), // min 2 and max 50 as length
    password: generalFieldsValidation.password.required(),
    confirmPassword: generalFieldsValidation.confirmPassword.valid(joi.ref('password')).required(),
    DOB: generalFieldsValidation.DOB,
    email: generalFieldsValidation.email.required(),
    gander: generalFieldsValidation.gander.required(),
    numberNational: generalFieldsValidation.nationalID.required().messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    department: generalFieldsValidation.userName.required().messages({
        'string.empty': 'department is required',
    }), // min 2 and max 50 as length
    phones : joi.alternatives().try( generalFieldsValidation.phone, generalFieldsValidation.phoneArray).required().messages({
        'alternatives.match': "Please provide a valid phone number or an array of phone numbers."
    }),
    'accept-language': generalFieldsValidation.acceptLanguage

}).options({allowUnknown: false}).required();



