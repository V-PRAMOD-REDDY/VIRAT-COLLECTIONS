import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // నోటిఫికేషన్ కోసం

const MyOrders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['_id'] = order._id; 
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 కొత్తగా యాడ్ చేసిన Cancel Order ఫంక్షన్
  const cancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.post(backendUrl + '/api/order/cancel', { orderId }, { headers: { token } });
        if (response.data.success) {
          toast.success("Order Cancelled Successfully!");
          loadOrderData(); // డేటాను రిఫ్రెష్ చేస్తుంది
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to cancel order");
      }
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16 px-4 md:px-10 pb-24 min-h-screen bg-white'>
      <div className='text-2xl mb-8'>
        <h2 className='font-black uppercase tracking-tighter text-gray-900'>My <span className='text-gray-400'>Orders</span></h2>
      </div>

      <div className='flex flex-col gap-6'>
        {!loading ? (
          orderData.length > 0 ? (
            orderData.map((item, index) => (
              <div key={index} className='py-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white rounded-3xl px-6 shadow-sm hover:shadow-md transition-all'>
                
                <div className='flex items-start gap-6 text-sm'>
                  <img 
                    className='w-16 sm:w-24 rounded-2xl border shadow-sm object-cover bg-gray-50' 
                    src={item.image && item.image[0] ? item.image[0] : 'https://placehold.co/400x400?text=Virat+Collections'} 
                    alt={item.name} 
                  />
                  <div className='flex flex-col gap-1'>
                    <p className='sm:text-lg font-black uppercase text-gray-900 leading-tight'>{item.name}</p>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1'>
                      Order ID: <span className='text-blue-600 font-mono'>{item._id}</span>
                    </p>
                    <div className='flex items-center gap-3 text-sm text-gray-500 font-bold mt-1'>
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <p className='bg-gray-100 px-2 py-0.5 rounded text-[10px] text-black'>{item.size}</p>
                    </div>
                  </div>
                </div>

                <div className='md:w-1/2 flex justify-between items-center bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : item.status === 'Cancelled' ? 'bg-red-500' : 'bg-orange-400 animate-pulse'}`}></p>
                    <p className='text-sm md:text-base font-black uppercase tracking-widest text-gray-800'>{item.status}</p>
                  </div>
                  
                  <div className='flex flex-col sm:flex-row gap-2'>
                    <button 
                      onClick={loadOrderData} 
                      className='border-2 border-gray-200 px-5 py-2.5 text-xs font-black rounded-xl uppercase hover:bg-black hover:text-white transition-all shadow-sm'
                    >
                      Track
                    </button>

                    {/* 👇 Cancel బటన్ - కేవలం 'Order Placed' లేదా 'Pending' లో ఉన్నప్పుడు మాత్రమే కనిపిస్తుంది */}
                    {(item.status === 'Order Placed' || item.status === 'Pending') && (
                      <button 
                        onClick={() => cancelOrder(item._id)} 
                        className='bg-red-50 text-red-600 border-2 border-red-100 px-5 py-2.5 text-xs font-black rounded-xl uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm'
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20'>No orders found!</div>
          )
        ) : (
          <div className='text-center py-20'>Loading Orders...</div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;