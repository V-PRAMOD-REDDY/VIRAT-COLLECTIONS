import crypto from 'crypto';
import axios from 'axios';
import orderModel from '../models/Order.js'; 
import userModel from '../models/userModel.js';

// PhonePe configuration
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_HOST_URL = process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Generate PhonePe checksum
const generatePhonePeChecksum = (payload, saltKey, saltIndex) => {
  const string = payload + '/pg/v1/pay' + saltKey;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + saltIndex;
};

// Verify PhonePe checksum
const verifyPhonePeChecksum = (receivedChecksum, payload, saltKey, saltIndex) => {
  const string = payload + saltKey;
  const expectedChecksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + saltIndex;
  return receivedChecksum === expectedChecksum;
};

// Create PhonePe payment order
export const phonePeOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const merchantTransactionId = `TXN${Date.now()}${userId.toString().slice(-4)}`;
    const merchantUserId = userId.toString();
    
    // PhonePe payment request payload
    const paymentPayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: amount * 100, // Amount in paise
      redirectUrl: `${process.env.VITE_BACKEND_URL}/api/payment/phonepe-callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.VITE_BACKEND_URL}/api/payment/phonepe-callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Convert payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    
    // Generate checksum
    const checksum = generatePhonePeChecksum(base64Payload, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    // PhonePe API request
    const options = {
      method: 'POST',
      url: `${PHONEPE_HOST_URL}/pg/v1/pay`,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'accept': 'application/json'
      },
      data: {
        request: base64Payload
      }
    };

    const response = await axios(options);
    
    if (response.data.success) {
      res.status(200).json({
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: merchantTransactionId,
        message: "PhonePe payment URL generated successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create PhonePe payment",
        error: response.data.message
      });
    }

  } catch (error) {
    console.error('PhonePe order creation error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create PhonePe payment",
      error: error.message
    });
  }
};

// Verify PhonePe payment
export const verifyPhonePe = async (req, res) => {
  try {
    const { 
      merchantTransactionId,
      orderData 
    } = req.body;
    
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Check payment status with PhonePe
    const statusUrl = `${PHONEPE_HOST_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
    const statusString = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}${PHONEPE_SALT_KEY}`;
    const statusChecksum = crypto.createHash('sha256').update(statusString).digest('hex') + '###' + PHONEPE_SALT_INDEX;

    const statusResponse = await axios({
      method: 'GET',
      url: statusUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': statusChecksum,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    if (statusResponse.data.success && statusResponse.data.data.state === 'COMPLETED') {
      // Payment successful - Create order in database
      const newOrder = new orderModel({
        userId,
        items: orderData.items,
        amount: orderData.amount,
        address: orderData.address,
        status: 'Order Placed',
        paymentMethod: 'PhonePe',
        payment: true,
        paymentId: merchantTransactionId,
        date: Date.now()
      });

      await newOrder.save();

      // Clear user cart
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).json({
        success: true,
        message: "Payment verified and order created successfully",
        orderId: newOrder._id
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed or payment not completed",
        paymentStatus: statusResponse.data.data.state
      });
    }

  } catch (error) {
    console.error('PhonePe payment verification error:', error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

// PhonePe callback handler
export const phonePeCallback = async (req, res) => {
  try {
    const { response } = req.body;
    
    // Decode the base64 response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
    
    if (decodedResponse.success && decodedResponse.data.state === 'COMPLETED') {
      // Redirect to success page
      res.redirect(`${process.env.VITE_FRONTEND_URL}/order-success?txn=${decodedResponse.data.merchantTransactionId}`);
    } else {
      // Redirect to failure page
      res.redirect(`${process.env.VITE_FRONTEND_URL}/payment-failed`);
    }
    
  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.redirect(`${process.env.VITE_FRONTEND_URL}/payment-failed`);
  }
};

export default { phonePeOrder, verifyPhonePe, phonePeCallback };
