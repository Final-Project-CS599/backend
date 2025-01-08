// import { AppError } from "../utils/AppError"


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