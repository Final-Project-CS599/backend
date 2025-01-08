import joi from "joi" ;


export const  generalFieldsValidation = {
    nationalID : joi.string().pattern(new RegExp(/^[0-9]{14,}$/)),
    userName :joi.string().required().min(2).max(100),
    email :joi.string().email({ minDomainSegments:2 , maxDomainSegments:3 , tlds: {allow: ['com' ,'net' , 'edu']}}).messages({
        'string.email' : "please enter valid email Ex: example@gmail.com" ,
        'string.empty' : "email cannot be empty",
        'any.required' : "email is required"
    }),
    password : joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,}$/)),
    confirmPassword : joi.string(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    phoneArray: joi.array().items(joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))),
    acceptLanguage: joi.string().valid('en' , 'ar').default('en'),
    DOB: joi.date().less("now"),
    gander: joi.string().valid('Male' , 'Female').default('Female'),
};

// passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validation = (scheme) => {
    return (req , res , next) => {
        
        const inputDate = {...req.body , ...req.query }; 
        if(req.headers['accept-language']){
            inputDate['accept-language'] = req.headers['accept-language'] 
        }

        const validationError = scheme.validate( inputDate , {abortEarly: false});
        if(validationError.error){
            return res.status(400).json({message:"Validation Error" , validationError:validationError.error.details});
        }

        return next();
    }
};
