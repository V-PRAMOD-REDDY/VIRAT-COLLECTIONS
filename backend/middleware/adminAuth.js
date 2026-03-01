import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user and check if they exist
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token. User not found." 
            });
        }

        // Check if user is admin (either by email or role field)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@viratcollections.com';
        if (user.email !== adminEmail) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        // Attach user to request object
        req.user = user;
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token." 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired. Please login again." 
            });
        }
        
        console.error('Admin Auth Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during authentication." 
        });
    }
}

export default adminAuth;