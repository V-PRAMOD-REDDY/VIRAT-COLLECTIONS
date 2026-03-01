import express from 'express';
import { phonePeOrder, verifyPhonePe, phonePeCallback } from '../controllers/paymentController.js';
import authUser from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Create PhonePe payment order
paymentRouter.post('/phonepe', authUser, phonePeOrder);

// Verify PhonePe payment
paymentRouter.post('/verify-phonepe', authUser, verifyPhonePe);

// PhonePe callback handler (no auth needed as it's called by PhonePe)
paymentRouter.post('/phonepe-callback', phonePeCallback);

export default paymentRouter;
