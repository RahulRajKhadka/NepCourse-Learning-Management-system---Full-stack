import express from "express";
import { login, logOut, signUP, sendOTP,verifyOTP,resetPassword, googleAuth  } from "../Controller/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUP);
authRouter.post("/login", login);

authRouter.get("/logout", logOut);
authRouter.post("/sendotp", sendOTP);
authRouter.post("/verifyotp", verifyOTP);
authRouter.post("/forgot-password", resetPassword);
authRouter.post("/googleauth", googleAuth);

export default authRouter;
