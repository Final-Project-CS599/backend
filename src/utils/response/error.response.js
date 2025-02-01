

export const errorAsyncHandler = (fn) => {
    return (req ,res ,next) => {
        return fn( req ,res ,next).catch(error => {
            return next(new Error(error.message || "Unknown error", { cause: 500 }));
        })
    }
};

export const globalErrorHandling = (error , req ,res ,next) => {
    if (error){
        if(process.env.MOOD == "development"){
            return res.status(error.cause || 400).json({ message:error.message, error, stack:error.stack});
        }
        return res.status(error.cause || 400).json({message:error.message});
    }
};

