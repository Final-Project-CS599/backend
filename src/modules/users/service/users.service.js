import dbConfig from "../../../DB/connection.js";
import { errorAsyncHandler } from "../../../utils/error/error.handling.js";
import { successResponse } from "../../../utils/response/success.response.js";


export const alterTableIStudent= errorAsyncHandler(
    async (req ,res ,next) =>{
        dbConfig.execute(`ALTER TABLE student MODIFY COLUMN s_password VARCHAR(255) NOT NULL` , (err , data) => {
            if(err || !data.affectedRows === 0){
                return next(new Error("Failed to get data , Faik to execute query" , {cause: 500}))
                // return res.status(500).json({ message: 'Failed to get data , Faik to execute query', error: err });
                }
                return successResponse({res , message: "Table altered successfully" , status: 200});
        })
    }
);

