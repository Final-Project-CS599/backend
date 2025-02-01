import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";



export const getAllDepartment = errorAsyncHandler(
    async (
        req, res, next
    )=>{
        dbConfig.execute(`SELECT d_dept_name from department`, (error, data )=>{
            if (error) {
                return next(new Error("Error server", { cause: 500 }));
            }
            return successResponse({res, message:'Department view successfully' ,
                data:data
            })
            
        })

    }

)