// import { AppError } from "../utils/AppError"

import { validationResult } from 'express-validator';

// export const validate = (schema) => {
//     return (req, res, next) => {
//         let {error} = schema.validate ({...req.body, ...req.param, ...req.query}, {abortEarly: false})
//         if(!error){
//             next()
//         } else {
//             let errMsgs = error.details.map(err => err.message)
//             next(new AppError( errMsgs, 401))
//         }
//     }
// }

export const validate = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // If no errors, proceed to the next middleware or route handler
};
