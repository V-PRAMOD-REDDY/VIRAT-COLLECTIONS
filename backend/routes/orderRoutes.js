import express from 'express';
import { 
    placeOrder, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
    verifyRazorpay,
    getOrderStatus 
} from '../controllers/orderController.js';

import authUser from '../middleware/authMiddleware.js'; 
import adminAuth from '../middleware/adminAuth.js'; // 👈 అడ్మిన్ సెక్యూరిటీ కోసం ఇది అవసరం
import { cancelOrder } from '../controllers/orderController.js';
import { deleteOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

// --- అడ్మిన్ రూట్స్ (Admin Routes) ---
// ఈ రూట్స్ కి adminAuth జోడించడం వల్ల కేవలం అడ్మిన్ మాత్రమే యాక్సెస్ చేయగలరు
orderRouter.post('/list', adminAuth, allOrders); // 👈 డాష్‌బోర్డ్ 404 ఎర్రర్ పోగొడుతుంది
orderRouter.post('/status', adminAuth, updateStatus);

// --- యూజర్ రూట్స్ (User Routes) ---
orderRouter.post('/place', authUser, placeOrder); 
orderRouter.post('/userorders', authUser, userOrders);

// --- పేమెంట్ రూట్స్ (Payment Routes) ---
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verify-razorpay', authUser, verifyRazorpay);

// --- ట్రాకింగ్ రూట్ (Tracking Route) ---
orderRouter.post('/status-track', getOrderStatus); 

// cancel Route
orderRouter.post('/cancel', authUser, cancelOrder);
// deleteOrder
orderRouter.post('/delete', adminAuth, deleteOrder);
export default orderRouter;