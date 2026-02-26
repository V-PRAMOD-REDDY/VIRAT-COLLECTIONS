import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { HiChatAlt2, HiOutlineTrash } from 'react-icons/hi';

const OrderManagement = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all orders from the database
  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Order (Safe Delete with Confirmation and Loader)
  const deleteOrderHandler = async (orderId) => {
    const userInput = prompt(`⚠️ WARNING: This action is permanent.\nTo confirm, please type the Order ID below:\n${orderId}`);
    
    if (userInput === orderId) {
      const loadToast = toast.loading("Deleting Order...");
      try {
        const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } });
        if (response.data.success) {
          toast.update(loadToast, { render: "Order Deleted Permanently! 🗑️", type: "success", isLoading: false, autoClose: 3000 });
          fetchAllOrders(); 
        } else {
          toast.update(loadToast, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
        }
      } catch (error) {
        toast.update(loadToast, { render: "Delete request failed", type: "error", isLoading: false, autoClose: 3000 });
      }
    } else if (userInput !== null) {
      toast.error("Order ID mismatch! Action cancelled.");
    }
  };

  // 3. Update Order Status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status Updated! 🚚");
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  // 4. Send WhatsApp Notification
  const openWhatsApp = (phone, name, status, orderId) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Hello ${name}, your order (ID: ${orderId}) from Virat Collections is currently: *${status}*. Thank you!`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen pb-20'>
      <div className='flex justify-between items-center mb-10'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-2xl md:text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black pb-1'>Order Management</h3>
          <p className='text-gray-400 text-[10px] font-black uppercase tracking-widest'>Manage your inventory and shipping</p>
        </div>
        <div className='hidden sm:block text-right'>
           <p className='text-gray-900 font-black text-xl'>{orders.length}</p>
           <p className='text-gray-400 text-[10px] font-bold uppercase tracking-widest'>Total Records</p>
        </div>
      </div>
      
      <div className='flex flex-col gap-6'>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] shadow-sm'>
            <div className='w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-gray-400 font-black uppercase tracking-widest animate-pulse'>Fetching Orders...</p>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className={`relative group grid grid-cols-1 sm:grid-cols-[0.8fr_2fr_1fr] lg:grid-cols-[0.8fr_2fr_1fr_1fr_1.2fr] gap-6 items-center p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border ${order.status === 'Cancelled' ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-200'}`}>
              
              {/* Delete Icon */}
              <button 
                onClick={() => deleteOrderHandler(order._id)}
                className='absolute top-6 right-6 p-2 text-gray-200 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-300'
                title="Delete Permanently"
              >
                <HiOutlineTrash size={22} />
              </button>

              {/* Product Image */}
              <div className='relative w-24 h-28 md:w-32 md:h-40 flex-shrink-0'>
                <img className={`w-full h-full object-cover rounded-3xl border shadow-md transition-all ${order.status === 'Cancelled' ? 'opacity-30 grayscale' : 'group-hover:scale-105'}`} src={order.items[0]?.image?.[0] || assets.parcel_icon} alt="Product" />
                {order.items.length > 1 && <span className='absolute -top-3 -right-3 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white'>+{order.items.length - 1}</span>}
              </div>
              
              {/* Order Content */}
              <div className='flex flex-col gap-2'>
                <div className='space-y-1.5'>
                  {order.items.map((item, i) => (
                    <p className='text-sm font-bold text-gray-800 flex items-center gap-2' key={i}>
                      <span className='w-1.5 h-1.5 bg-blue-500 rounded-full'></span>
                      {item.name} x {item.quantity} 
                      <span className='text-blue-600 font-black text-[9px] bg-blue-50 px-2 py-0.5 rounded uppercase'>{item.size}</span>
                    </p>
                  ))}
                </div>
                <hr className='my-2 border-gray-100' />
                <p className='font-black uppercase text-sm text-gray-900 tracking-tight'>{order.address.firstName} {order.address.lastName}</p>
                <div className='text-gray-500 text-[11px] font-bold uppercase tracking-tight'>
                  <p>{order.address.city}, {order.address.state}</p>
                  <div className='mt-3 flex items-center gap-3'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-black font-black'>{order.address.phone}</span>
                    <button onClick={() => openWhatsApp(order.address.phone, order.address.firstName, order.status, order._id)} className='flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest border border-green-100 shadow-sm'>
                      <HiChatAlt2 size={16} /> Contact
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className='text-[11px] font-bold text-gray-400 flex flex-col gap-2'>
                <p className='uppercase tracking-widest'>Payment: <span className='text-black font-black bg-gray-100 px-2 py-0.5 rounded-md ml-1'>{order.paymentMethod}</span></p>
                <p className='uppercase tracking-widest'>Date: <span className='text-gray-900 ml-1'>{new Date(order.date).toLocaleDateString()}</span></p>
                <p className='mt-2 text-[9px] font-mono text-blue-500 bg-blue-50 p-2 rounded-xl break-all uppercase leading-tight'>{order._id}</p>
              </div>

              {/* Total Amount */}
              <p className={`text-3xl font-black tracking-tighter ${order.status === 'Cancelled' ? 'text-gray-300 line-through' : 'text-black'}`}>{currency}{order.amount.toLocaleString()}</p>

              {/* Status Selector */}
              <select 
                onChange={(event) => statusHandler(event, order._id)} 
                value={order.status} 
                className={`w-full p-4 font-black text-[10px] uppercase border-2 rounded-2xl outline-none cursor-pointer transition-all ${order.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 focus:border-black hover:bg-white shadow-sm'}`}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled ❌</option>
              </select>
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100'>
            <img src={assets.parcel_icon} className='w-20 opacity-10 mb-4' alt="" />
            <p className='text-gray-300 font-black uppercase tracking-[0.3em] text-sm'>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;