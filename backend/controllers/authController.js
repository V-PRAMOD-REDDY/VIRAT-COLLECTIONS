import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Create JWT token with expiry
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
    });
}

// Input validation helper
const validateInput = (name, email, password) => {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    }
    
    return errors;
}

// User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        const validationErrors = validateInput(name, email, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed', 
                errors: validationErrors 
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: "An account with this email already exists" 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const userData = {
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Generate token
        const token = createToken(user._id);
        
        res.status(201).json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: "Account created successfully"
        });
        
    } catch (error) {
        console.error('Registration Error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already exists" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Server error during registration. Please try again." 
        });
    }
}

// User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a valid email address" 
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Generate token
        const token = createToken(user._id);
        
        res.status(200).json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: "Login successful"
        });
        
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login. Please try again." 
        });
    }
}

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@viratcollections.com';
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Validate admin credentials
        if (email !== adminEmail) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid admin credentials" 
            });
        }

        // For admin, check against env password or find admin user in database
        let isValidAdmin = false;
        
        if (adminPassword && password === adminPassword) {
            isValidAdmin = true;
        } else {
            // Fallback: check if admin user exists in database
            const adminUser = await userModel.findOne({ email: adminEmail });
            if (adminUser) {
                isValidAdmin = await bcrypt.compare(password, adminUser.password);
            }
        }

        if (!isValidAdmin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid admin credentials" 
            });
        }

        // Create admin token
        const token = jwt.sign(
            { id: 'admin', email: adminEmail, role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(200).json({ 
            success: true, 
            token,
            message: "Admin login successful" 
        });
        
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during admin login" 
        });
    }
}