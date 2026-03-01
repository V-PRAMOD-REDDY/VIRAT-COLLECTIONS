import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
    });
}

// 1. Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            message: "Profile retrieved successfully"
        });
        
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve profile" 
        });
    }
}

// 2. Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        const { name, phone, address } = req.body;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        // Input validation
        if (name && name.trim().length < 2) {
            return res.status(400).json({ 
                success: false, 
                message: "Name must be at least 2 characters long" 
            });
        }

        if (phone && !validator.isMobilePhone(phone, 'any')) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a valid phone number" 
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            updateData, 
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully! ✅", 
            user: updatedUser 
        });
        
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update profile" 
        });
    }
}

// 3. Google Login
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ 
                success: false, 
                message: "Google token is required" 
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({ 
            idToken: token, 
            audience: process.env.GOOGLE_CLIENT_ID 
        });
        
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email not provided by Google" 
            });
        }

        // Check if user exists
        let user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create new user for Google login
            const userData = {
                name: name || 'Google User',
                email: email.toLowerCase(),
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 12),
                ...(picture && { image: picture })
            };
            
            user = new userModel(userData);
            await user.save();
        }

        // Generate JWT token
        const jwtToken = createToken(user._id);
        
        res.status(200).json({ 
            success: true, 
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: "Google login successful"
        });
        
    } catch (error) {
        console.error('Google Login Error:', error);
        
        if (error.message.includes('verify')) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Google token" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Google login failed. Please try again." 
        });
    }
}