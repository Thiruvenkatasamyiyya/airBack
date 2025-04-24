import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        return next(new ErrorHandler("Login first to access the resources",401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    console.log(req.user);

    next();
})