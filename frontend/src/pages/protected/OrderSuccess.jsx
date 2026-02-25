import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiArrowRight } from 'react-icons/hi';

const OrderSuccess = () => {
  const navigate = useNavigate();

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