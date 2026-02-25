import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const { backendUrl } = useContext(ShopContext);

  const steps = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const trackOrderHandler = async (e) => {
    e.preventDefault();
    try {
      // బ్యాకెండ్ నుండి ఆర్డర్ వివరాలు తీసుకురావడం
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId });
      if (response.data.success) {
        setOrderData(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Invalid Order ID or Server Error");
    }
  };

  return (
    <div className='px-4 md:px-10 py-10 min-h-[70vh]'>
      <div className='max-w-3xl m-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
        <h2 className='text-2xl font-black mb-8 text-center uppercase tracking-widest'>Track Your Order</h2>
        
        {/* Search Bar */}
        <form onSubmit={trackOrderHandler} className='flex gap-2 mb-10'>
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g. #VRC123)" 
            className='border rounded-lg px-4 py-2 w-full outline-none focus:border-black'
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          <button type='submit' className='bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all'>TRACK</button>
        </form>

        {orderData ? (
          <>
            <div className='flex flex-col md:flex-row justify-between items-center relative gap-4'>
              {steps.map((step, index) => (
                <div key={index} className='flex flex-col items-center flex-1 z-10'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-all duration-500 
                    ${steps.indexOf(orderData.status) >= index ? 'bg-green-500 scale-110 shadow-lg' : 'bg-gray-200'}`}>
                    {steps.indexOf(orderData.status) >= index ? '✓' : index + 1}
                  </div>
                  <p className={`text-[10px] font-black uppercase ${steps.indexOf(orderData.status) >= index ? 'text-green-600' : 'text-gray-400'}`}>
                    {step}
                  </p>
                </div>
              ))}
              <div className='hidden md:block absolute top-5 left-0 h-[2px] bg-gray-100 w-full -z-0'></div>
            </div>

            <div className='mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <p><span className='text-gray-500'>Order ID:</span> <br /> <strong>#{orderData._id}</strong></p>
                <p><span className='text-gray-500'>Customer:</span> <br /> <strong>{orderData.address.firstName} {orderData.address.lastName}</strong></p>
                <p><span className='text-gray-500'>Current Status:</span> <br /> <span className='text-green-600 font-bold uppercase'>{orderData.status}</span></p>
                <p><span className='text-gray-500'>Last Update:</span> <br /> <strong>{new Date(orderData.date).toDateString()}</strong></p>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center py-10 text-gray-400'>
            <p>Enter your Order ID to see live tracking status.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;