import orderModel from "../models/Order.js"; 
import userModel from "../models/userModel.js";

// --- User Features ---

// 1. Place Order with Cash on Delivery (COD)
export const placeOrder = async (req, res) => {
    try {
        // Get userId from auth middleware (req.userId)
        const userId = req.userId || req.user?._id;
        const { items, amount, address } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Order items are required" 
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Valid order amount is required" 
            });
        }

        if (!address || !address.street || !address.city) {
            return res.status(400).json({ 
                success: false, 
                message: "Complete delivery address is required" 
            });
        }

        // Create order data
        const orderData = {
            userId, 
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ 
            success: true, 
            orderId: newOrder._id,
            message: "Order placed successfully! 🎉" 
        });

    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to place order. Please try again." 
        });
    }
}

// 2. Get User Order History
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        
        res.status(200).json({ 
            success: true, 
            orders,
            message: "Orders retrieved successfully" 
        });
        
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve orders" 
        });
    }
}

// --- ట్రాకింగ్ ఫీచర్ ---
export const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        
        if (order) {
            res.json({ success: true, order });
        } else {
            res.json({ success: false, message: "Order not found!" });
        }
    } catch (error) {
        res.json({ success: false, message: "Invalid Order ID." });
    }
}

// --- అడ్మిన్ ఫీచర్స్ ---

export const allOrders = async (req, res) => {
    try {
        // అన్ని ఆర్డర్లను వెలికితీసి లేటెస్ట్ వి ముందు వచ్చేలా (Sorting) చేయడం
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order Status Updated! ✅" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- Cancel Order (యూజర్ ద్వారా) ---
export const cancelOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body; 
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found!" });
        }

        if (order.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized access!" });
        }

        if (order.status === 'Order Placed') {
            await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled' });
            res.json({ success: true, message: "Order Cancelled! ❌" });
        } else {
            res.json({ success: false, message: "Order is already being processed or delivered." });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- Delete Order (అడ్మిన్ ద్వారా శాశ్వతంగా తొలగించడం) ---
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const deletedOrder = await orderModel.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.json({ success: true, message: "Order Deleted from database! 🗑️" });
        } else {
            res.json({ success: false, message: "Order already deleted or not found." });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- Razorpay (Coming Soon) ---
export const placeOrderRazorpay = async (req, res) => { res.json({ success: false, message: "Coming soon" }); }
export const verifyRazorpay = async (req, res) => { res.json({ success: false, message: "Coming soon" }); }