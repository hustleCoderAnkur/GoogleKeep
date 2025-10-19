import { ApiError } from "../utils/apiError";

const errorHandler = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.error('Error', err);
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.isOperational ? err.message : " Something went wrong, please try later"
    })
}
const notFound = (req,res,next) => {
    next(new ApiError(`can't find ${req.orignalUrl} on this server`, 400))
}

module.exports = {
    errorHandler,
    notFound
}