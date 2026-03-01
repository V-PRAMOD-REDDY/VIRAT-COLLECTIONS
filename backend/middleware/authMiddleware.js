import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Please login to continue.' 
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user and verify they exist
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token. User not found.' 
            });
        }

        // Attach user to request object (not req.body)
        req.user = user;
        req.userId = user._id; // For backward compatibility
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format.' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again.' 
            });
        }
        
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication server error.' 
        });
    }
}

export default authUser;