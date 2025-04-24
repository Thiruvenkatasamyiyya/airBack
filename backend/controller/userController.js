
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import User from '../model/user.js'
import ErrorHandler from "../utils/errorHandler.js"
import { makeToken, sendChanged, verifyToken } from "../utils/nodeMailer.js";
import sendToken from "../utils/sendToken.js";
import jwt from "jsonwebtoken";

// Register User => api/v1/register

export const registerUser = catchAsyncErrors(async(req, res) => {

    const {name, email, password} = req.body;

    const user = await User.create({
        name, 
        email,
        password
    })

    // const token = user.getJwtToken();

    // res.status(201).json({
    //     token
    // })

    sendToken(user, 201, res)


})

// Login User => /api/v1/login
export const loginUser = catchAsyncErrors(async(req, res, next) => {

    const {email, password} = req.body;



    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password",400));
    }

    // Find user in the database
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // const token = user.getJwtToken();

    // res.status(200).json({
    //     token
    // })

    sendToken(user, 201, res)

})

// Logout user => api/v1/logout
export const logout = catchAsyncErrors(async(req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        message:"Logged out"
    })


})


// forget password
export const forgetPassword = catchAsyncErrors(async(req,res,next)=>{

    const {email} = req.body

    if(!email){
        return next(new ErrorHandler("Enter the email",400))
    }

    const user = await User.findOne({email})
    if(!user){
        return next (new ErrorHandler("user is not found",401))
    }

    const {token,expires} = makeToken(user)

    user.resetPasswordToken = token
    user.resetPasswordExpire = expires


    res.status(201).json({
        message : 'send successfully'
    })
})


// verify and update password

export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.params
    const {password} =req.body

    if(!password){
        return next(new ErrorHandler('Enter the password',400))
    }

    const decoder = await verifyToken(token);

    const user = await User.findById(decoder.id)

    if(!user){
        res.status(401).json({
            message : 'Invaild or Expired Token'
        })
    }
    user.password = password
    user.resetPasswordToken =null
    user.resetPasswordExpire =null
    await user.save()

    sendChanged(user)

    res.status(200).json({
        message : 'successfully changed',
        user
    })
})

