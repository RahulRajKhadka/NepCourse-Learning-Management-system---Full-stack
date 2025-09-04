// In Routes/userRoute.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/Multer.js";
import { getCurrentUser, updateProfile } from "../Controller/userController.js";

const userRouter = express.Router();

userRouter.get("/getcurrentuser", isAuth, getCurrentUser);


userRouter.put("/profile", isAuth, upload.single("photoUrl"), updateProfile);

export default userRouter;
 