import jwt from "jsonwebtoken";


export const generateToken = ({payload={} , signature = process.env.TOKEN_SIGNATURE, options={}} = {}) => {
    const expiresIn  = process.env.MOOD == "development" 
    ? parseInt(process.env.SYSTEM_EXPIREINTOKEN_DEV ,10)
    : parseInt(process.env.SYSTEM_EXPIREINTOKEN_PROD ,10)

    if (!options.expiresIn) {
        options.expiresIn = expiresIn
    }
    const token = jwt.sign(payload , signature , options)
    return token;
};



export const verifyToken = ({token = "" , signature = process.env.TOKEN_SIGNATURE} = {}) => {
    const decoded = jwt.verify(token , signature )
    return decoded;
};



