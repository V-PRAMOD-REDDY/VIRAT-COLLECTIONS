import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiExclamation, HiArrowLeft, HiRefresh } from 'react-icons/hi';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-white">
      {/* Failed Icon */}
      <div className="bg-red-50 p-8 rounded-full mb-8 shadow-inner">
        <HiExclamation className="text-8xl text-red-500" />
      </div>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">
        Payment <span className="text-red-600">Failed</span>
      </h1>
      
      <p className="text-gray-500 max-w-lg mb-10 font-medium leading-relaxed">
        Unfortunately, your payment could not be processed. Please check your payment method and try again. 
        Your items are still in your cart.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
        <button 
          onClick={() => navigate('/cart')} 
          className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          <HiRefresh className="text-lg" />
          Try Again
        </button>
        
        <button 
          onClick={() => navigate('/shop')} 
          className="flex-1 bg-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <HiArrowLeft className="text-lg" />
          Continue Shopping
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-2xl max-w-md">
        <h3 className="font-bold text-gray-700 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-3">
          If you continue to face issues with payment, please contact our support team.
        </p>
        <button 
          onClick={() => navigate('/contact')} 
          className="text-blue-600 text-sm font-semibold underline hover:text-blue-800"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;