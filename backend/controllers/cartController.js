import userModel from "../models/userModel.js";

// 1. Add items to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        const { itemId, size } = req.body;

        // Validate authentication
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        // Validate required fields
        if (!itemId || !size) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID and size are required" 
            });
        }

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found. Please login again." 
            });
        }

        let cartData = userData.cartData || {};

        // Add or update cart item
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
        
        res.status(200).json({ 
            success: true, 
            message: "Item added to cart successfully ✅" 
        });

    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to add item to cart" 
        });
    }
}

// 2. Update cart quantity
export const updateCart = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        const { itemId, size, quantity } = req.body;

        // Validate authentication
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        // Validate required fields
        if (!itemId || !size || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID, size, and quantity are required" 
            });
        }

        // Validate quantity
        if (quantity < 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Quantity cannot be negative" 
            });
        }

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found. Please login again." 
            });
        }

        let cartData = userData.cartData || {};

        // Update or remove item based on quantity
        if (quantity === 0) {
            // Remove item completely
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                // If no sizes left for this item, remove the item entirely
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            // Update quantity
            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        
        res.status(200).json({ 
            success: true, 
            message: "Cart updated successfully ✅" 
        });

    } catch (error) {
        console.error('Update Cart Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update cart" 
        });
    }
}

// 3. Get user cart data
export const getUserCart = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const cartData = userData.cartData || {};
        
        res.status(200).json({ 
            success: true, 
            cartData,
            message: "Cart data retrieved successfully" 
        });
        
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve cart data" 
        });
    }
}