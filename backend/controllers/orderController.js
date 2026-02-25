import orderModel from "../models/Order.js"; 
import userModel from "../models/userModel.js";

// --- యూజర్ ఫీచర్స్ ---

// 1. Cash on Delivery (COD) పద్ధతిలో ఆర్డర్ ప్లేస్ చేయడం
export const placeOrder = async (req, res) => {
    try {
        // req.body నుండి userId వస్తుంది (authUser మిడిల్‌వేర్ ద్వారా)
        const { userId, items, amount, address } = req.body;

        // సెక్యూరిటీ చెక్: userId లేకపోతే ఎర్రర్ ఆపడం
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated!" });
        }

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

        // ఆర్డర్ సేవ్ అయిన తర్వాత యూజర్ కార్ట్ క్లియర్ చేయడం
        // ఇది 'TypeError: Cannot read properties of null (reading cartData)' ఎర్రర్‌ను నివారిస్తుంది
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully! 🎉" });

    } catch (error) {
        console.log("Order Placement Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// 2. యూజర్ తన ఆర్డర్ హిస్టరీని చూసుకోవడం
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({ success: false, message: "User not identified!" });
        }

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
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