import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// 1. యూజర్ లాగిన్
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. యూజర్ రిజిస్ట్రేషన్
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
        if (password.length < 8) return res.json({ success: false, message: "Password too short" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. యూజర్ ప్రొఫైల్ వివరాలను పొందడం
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body; 
        const user = await userModel.findById(userId).select('-password');
        if (user) {
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 4. ప్రొఫైల్ వివరాలను అప్‌డేట్ చేయడం 
// backend/controllers/userController.js

export const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address } = req.body; 

        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { name, phone, address }, 
            { 
                // new: true, // 👈 దీన్ని తొలగించండి
                returnDocument: 'after', // 👈 వార్నింగ్ రాకుండా ఇది వాడండి
                runValidators: true 
            }
        );

        if (updatedUser) {
            res.json({ success: true, message: "Profile Updated Successfully! ✅", user: updatedUser });
        } else {
            res.json({ success: false, message: "Update Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 5. గూగుల్ లాగిన్
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { name, email, picture } = ticket.getPayload();
        let user = await userModel.findOne({ email });

        if (!user) {
            user = new userModel({
                name, email, 
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                image: picture
            });
            await user.save();
        }
        const jwtToken = createToken(user._id);
        res.json({ success: true, token: jwtToken });
    } catch (error) {
        res.json({ success: false, message: "Google verification failed" });
    }
}

 // అడ్మిన్ లాగిన్ ఫంక్షన్
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // adminAuth లో చెక్ చేసే విధంగానే ఇక్కడ టోకెన్ స్ట్రింగ్ ఉండాలి
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Admin Credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}