import joi from "joi" ;



export const  generalFieldsValidation = {
    // National ID
    nationalID : joi.string().pattern(new RegExp(/^[0-9]{14}$/)).messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    // User Name
    userName :joi.string().required().min(2).max(100),
    // Email
    email :joi.string().email({ minDomainSegments:2 , maxDomainSegments:3 , tlds: {allow: ['com' ,'net' , 'edu']}}).messages({
        'string.email' : "please enter valid email Ex: example@gmail.com" ,
        'string.empty' : "email cannot be empty",
        'any.required' : "email is required"
    }),
    // Add Users and Admin
    passwordAddUsers : joi.string(),
    // Add Instructor
    passwordAddInstructor : joi.string().pattern(new RegExp(/^[0-9]{14}$/)).messages({
        'string.empty' : "password cannot be empty",
        'string.pattern.base': 'password must be exactly 14 digits National ID (example: 12345678910121) ',
    }),
    // Login and Reset Password
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]?)[a-zA-Z0-9@#$%^&*-_]{8,}$/)).messages({
        'string.empty' : "password cannot be empty",
        'string.pattern.base': 'password must be exactly 8 digits (example: 12345678 , A.s12345 , a1234567 , a.x12345 ,a.@x12345) ',
    }),
    confirmPassword : joi.string(),
    // Phone
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).messages({
        'alternatives.match': "Please provide a valid phone number ex: (+201234567810 , 00201234567810 , 01234567810)"
    }),
    phone2: joi.string().allow('', null).pattern(new RegExp(/^[0-9]{11,14}$/)),

    // Language
    acceptLanguage: joi.string().valid('en' , 'ar' ,'en-US' ,"en-US,en;q=0.9").default('en'),
    // DOB
    DOB: joi.date().less("now"),
    // Gander
    gander: joi.string().valid('Male' , 'Female').default('Female'),
    // Code Password
    code: joi.string().pattern(new RegExp(/^[A-Za-z0-9\-+_$!%*#?&]{6}$/)).messages({
        'string.pattern.base': 'Code must be exactly 6 digits (send Code Check to email)',
    }),
    //Courses
    course: joi.string().min(2).max(100),
    courseDescription: joi.string().min(20).max(500),
    courseDate: joi.date(),
};


export const validation = (scheme) => {
    return (req , res , next) => {
        
        const inputDate = {...req.body , ...req.query  };

        // abortEarly to get all errors
        const validationError = scheme.validate( inputDate , {abortEarly: false});
        if(validationError.error){
            return res.status(400).json({
                message: `Validation Error in the check input ${validationError.error.details[0].message}` , 
                validationError:validationError.error.details.message
            });
        }

        return next();
    }
};
