import express from "express";
import {registerUser, loginUser, logout, forgetPassword, resetPassword} from "../controller/userController.js";

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route('/forget').get(forgetPassword)
router.route('/reset/:token').post(resetPassword)

export default router;