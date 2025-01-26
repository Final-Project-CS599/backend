import { nanoid } from 'nanoid';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';
import { emailEvent } from '../../../../utils/events/sendEmailEvent.js';
import { compareHash, generateHash } from '../../../../utils/hash/hash.js';



export const forgotPassword = errorAsyncHandler(
    
);
export const verifyCode = errorAsyncHandler(
    
);

export const resetPasswordUtility = async (tableName, emailColumn, passwordColumn, email, newPassword, res, next) => {
    return new Promise((resolve, reject) => {
        
    });
};

export const resetPassword = errorAsyncHandler(
    
);
