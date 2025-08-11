import express from "express";
import { SignUp, Login, refreshToken, logout, forgetPassword, verfiyResetCode, resetPassword} from "./authentication.controller.js";
import {validateLogin, validateSignup} from './authenicationschema.js';

const authenticationRouter = express.Router();
authenticationRouter.post("/signup",validateSignup, SignUp);
authenticationRouter.post("/login", validateLogin,Login);
authenticationRouter.post("/refresh-token", refreshToken);
authenticationRouter.post("/logout", logout);
authenticationRouter.post("/forget-password", forgetPassword);
authenticationRouter.post("/verify-reset-code", verfiyResetCode);
authenticationRouter.post("/reset-password", resetPassword);
export default authenticationRouter;