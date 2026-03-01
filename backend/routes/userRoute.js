import express from "express";
import { registerUser, loginUser, adminLogin } from "../controllers/authController.js";
import { getUserProfile, updateProfile, googleLogin } from "../controllers/userController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Authentication routes - using authController
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// User management routes - using userController
userRouter.post('/google-login', googleLogin);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateProfile);

export default userRouter;