import { ApiError } from "../utils/ApiError.js"
const notFoundHandler = (req,res,next) => {
    next(new ApiError(404,`Route not found: ${req.method}`));
}
const errorHandler = (err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];
    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate resource";
        errors = Object.keys(err.keyPattern || {});
    }
    return res.status(statusCode).json({
        statusCode,
        data: null,
        success: false,
        message,
        errors,
        requestId: req.id,
        ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
    });
}
export {notFoundHandler,errorHandler} 