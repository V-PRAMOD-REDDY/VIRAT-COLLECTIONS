import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const admin_id = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

        if (token_decode !== admin_id) {
             return res.json({ success: false, message: "Invalid Admin Token" });
        }

        next(); 
    } catch (error) {
        res.json({ success: false, message: "Session Expired. Please Login Again" });
    }
}

// 👈 ఈ లైన్ సరిగ్గా ఉందో లేదో చూసుకోండి (Syntax Error రావడానికి ఇదే కారణం)
export default adminAuth;