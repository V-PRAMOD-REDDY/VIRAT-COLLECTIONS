import express from "express";
import { loginUser, registerUser, getUserProfile, updateProfile, adminLogin, googleLogin } from "../controllers/userController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/google-login', googleLogin);

userRouter.post('/update-profile', authUser, updateProfile);
userRouter.post('/get-profile', authUser, getUserProfile);

export default userRouter;