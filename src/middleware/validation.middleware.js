import joi from "joi" ;



export const  generalFieldsValidation = {
    nationalID : joi.string().pattern(new RegExp(/^[0-9]{14,}$/)).messages({
        'string.empty': "National ID is required",
        'string.pattern.base': "National ID must be 14 digits with no spaces or characters. (example: 01234567890123)"
    }),
    userName :joi.string().required().min(2).max(100),
    email :joi.string().email({ minDomainSegments:2 , maxDomainSegments:3 , tlds: {allow: ['com' ,'net' , 'edu']}}).messages({
        'string.email' : "please enter valid email Ex: example@gmail.com" ,
        'string.empty' : "email cannot be empty",
        'any.required' : "email is required"
    }),
    passwordAddUsers : joi.string().pattern(new RegExp(/^[0-9]{14,}$/)).messages({
        'string.empty' : "password cannot be empty",
        'string.pattern.base': 'password must be exactly 14 digits National ID (example: 12345678910121) ',
    }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]?)[a-zA-Z0-9!@#$%^&*-_+=]{8,}$/)).messages({
        'string.empty' : "password cannot be empty",
        'string.pattern.base': 'password must be exactly 8 digits (example: 12345678 , A.s12345 , a1234567 , a.x12345 ,a.@x12345) ',
    }),
    confirmPassword : joi.string(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).messages({
        'alternatives.match': "Please provide a valid phone number ex: (+201234567810 , 00201234567810 , 01234567810)"
    }),
    phoneArray: joi.array().items(joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))),
    acceptLanguage: joi.string().valid('en' , 'ar' ,'en-US' ,"en-US,en;q=0.9").default('en'),
    DOB: joi.date().less("now"),
    gander: joi.string().valid('Male' , 'Female').default('Female'),
    code: joi.string().pattern(new RegExp(/^[A-Za-z0-9\-+_$!%*#?&]{6}$/)).messages({
        'string.pattern.base': 'Code must be exactly 6 digits (send Code Check to email)',
    }),
    course: joi.string().min(2).max(100),
    courseDescription: joi.string().min(20).max(500),
    courseDate: joi.date(),
};


export const validation = (scheme) => {
    return (req , res , next) => {
        
        const inputDate = {...req.body , ...req.query };

        const validationError = scheme.validate( inputDate , {abortEarly: false});
        if(validationError.error){
            return res.status(400).json({message:`Validation Error in the check input` , validationError:validationError.error.details});
        }

        return next();
    }
};
