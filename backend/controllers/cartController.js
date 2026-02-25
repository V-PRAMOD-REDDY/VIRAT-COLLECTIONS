import userModel from "../models/userModel.js";

// 1. కార్ట్‌కి వస్తువులను యాడ్ చేయడం
export const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        // యూజర్ ఐడి ఉందో లేదో ప్రాథమిక తనిఖీ
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId);
        
        // --- 👈 ఎర్రర్ ఫిక్స్: యూజర్ దొరకకపోతే null pointer రాకుండా ఆపుతుంది ---
        if (!userData) {
            return res.json({ success: false, message: "User not found! Please login again." });
        }

        let cartData = await userData.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart ✅" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 2. కార్ట్ డేటాను అప్‌డేట్ చేయడం
export const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found!" });
        }

        let cartData = await userData.cartData || {};

        // వస్తువు మరియు సైజు ఉంటేనే క్వాంటిటీ మార్చాలి
        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 3. యూజర్ కార్ట్ డేటాను పొందడం
export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found!" });
        }

        let cartData = await userData.cartData || {};

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}