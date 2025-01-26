import dbConfig from "../../../../DB/connection.js";
import { roleTypes } from "../../../../middleware/auth.middleware.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from "../../../../utils/response/success.response.js";
import { verifyToken } from "../../../../utils/token/token.js";



const confirmEmail = errorAsyncHandler(
    async (req, res, next) => {

    }
);


export default confirmEmail;
