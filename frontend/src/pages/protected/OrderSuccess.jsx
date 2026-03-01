import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiArrowRight, HiExclamation, HiRefresh } from 'react-icons/hi';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, backendUrl, setCartItems } = useContext(ShopContext);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const transactionId = searchParams.get('txn');
  const isPhonePeCallback = !!transactionId;

  useEffect(() => {
    if (isPhonePeCallback && token) {
      verifyPhonePePayment();
    }
  }, [transactionId, token]);

  const verifyPhonePePayment = async () => {
    try {
      setIsVerifying(true);
      
      // Get pending order data from localStorage
      const pendingOrderData = localStorage.getItem('pendingOrder');
      if (!pendingOrderData) {
        toast.error("Order data not found. Please try again.");
        navigate('/cart');
        return;
      }

      const orderData = JSON.parse(pendingOrderData);
      
      // Verify payment with backend
      const verifyRes = await axios.post(`${backendUrl}/api/payment/verify-phonepe`, {
        merchantTransactionId: transactionId,
        orderData: orderData
      }, { headers: { token } });

      if (verifyRes.data.success) {
        setVerificationResult({ success: true });
        setCartItems({});
        localStorage.removeItem('pendingOrder');
        toast.success("Payment verified! Order placed successfully 🎉");
      } else {
        setVerificationResult({ 
          success: false, 
          message: verifyRes.data.message || "Payment verification failed" 
        });
        toast.error("Payment verification failed");
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationResult({ 
        success: false, 
        message: "Failed to verify payment. Please contact support." 
      });
      toast.error("Payment verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // If it's a PhonePe callback and still verifying
  if (isPhonePeCallback && isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-white">
        <div className="bg-blue-50 p-8 rounded-full mb-8 shadow-inner">
          <HiRefresh className="text-8xl text-blue-500 animate-spin" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">
          Verifying <span className="text-blue-600">Payment...</span>
        </h1>
        <p className="text-gray-500 max-w-lg mb-10 font-medium leading-relaxed">
          Please wait while we verify your PhonePe payment. This may take a few seconds.
        </p>
      </div>
    );
  }

  // If verification failed
  if (isPhonePeCallback && verificationResult && !verificationResult.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-white">
        <div className="bg-red-50 p-8 rounded-full mb-8 shadow-inner">
          <HiExclamation className="text-8xl text-red-500" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">
          Payment <span className="text-red-600">Failed</span>
        </h1>
        <p className="text-gray-500 max-w-lg mb-10 font-medium leading-relaxed">
          {verificationResult.message}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
          <button 
            onClick={() => navigate('/cart')} 
            className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/shop')} 
            className="flex-1 bg-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-300 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-white">
      {/* యానిమేటెడ్ గ్రీన్ టిక్ మార్క్ */}
      <div className="bg-green-50 p-8 rounded-full mb-8 shadow-inner">
        <HiCheckCircle className="text-8xl text-green-500 animate-pulse" />
      </div>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">
        Order Placed <span className="text-green-600">Successfully!</span>
      </h1>
      
      <p className="text-gray-500 max-w-lg mb-10 font-medium leading-relaxed">
        Your order has been received and is being processed by our team. 
        You will receive a confirmation email shortly. Thank you for choosing Virat Collections!
      </p>

      {/* యాక్షన్ బటన్స్ */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
        <button 
          onClick={() => navigate('/orders')} 
          className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-1"
        >
          My Orders
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="flex-1 flex items-center justify-center gap-2 border-2 border-black px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-50 transition-all"
        >
          Shop More <HiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;