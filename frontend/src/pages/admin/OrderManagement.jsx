import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { HiChatAlt2, HiOutlineTrash } from 'react-icons/hi'; // 👈 ట్రాష్ ఐకాన్ యాడ్ చేశాను

const OrderManagement = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 👇 సురక్షితమైన డిలీట్ ఫంక్షన్ (Double Check)
  const deleteOrderHandler = async (orderId) => {
    const userInput = prompt(`⚠️ WARNING: This action cannot be undone.\nTo delete this order, please type the Order ID below:\n${orderId}`);
    
    if (userInput === orderId) {
      try {
        const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } });
        if (response.data.success) {
          toast.success("Order Deleted Permanently! 🗑️");
          fetchAllOrders(); // లిస్ట్ రిఫ్రెష్ చేస్తుంది
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Delete request failed");
      }
    } else if (userInput !== null) {
      toast.error("ID Match అవ్వలేదు! డిలీట్ చేయబడలేదు.");
    }
  };

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

  const openWhatsApp = (phone, name, status, orderId) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Hello ${name}, your order (ID: ${orderId}) is currently: *${status}*. Thank you!`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h3 className='text-2xl font-black uppercase tracking-tight text-gray-900'>Order Management</h3>
        <p className='text-gray-500 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100'>Total Orders: {orders.length}</p>
      </div>
      
      <div className='flex flex-col gap-6'>
        {loading ? (
          <div className='text-center py-20 bg-white rounded-3xl'><p className='animate-pulse text-gray-400 font-black uppercase'>Loading...</p></div>
        ) : orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className={`relative grid grid-cols-1 sm:grid-cols-[0.8fr_2fr_1fr] lg:grid-cols-[0.8fr_2fr_1fr_1fr_1.2fr] gap-4 items-center border p-6 md:p-8 rounded-3xl shadow-sm transition-all ${order.status === 'Cancelled' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              
              {/* 👇 Delete Button (Top Right Corner) */}
              <button 
                onClick={() => deleteOrderHandler(order._id)}
                className='absolute top-4 right-4 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all'
                title="Delete Permanently"
              >
                <HiOutlineTrash className='text-xl' />
              </button>

              <div className='relative w-20 h-24 md:w-28 md:h-32 flex-shrink-0'>
                <img className={`w-full h-full object-cover rounded-2xl border shadow-sm ${order.status === 'Cancelled' ? 'opacity-40 grayscale' : ''}`} src={order.items[0]?.image?.[0] || assets.parcel_icon} alt="Product" />
                {order.items.length > 1 && <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full'>+{order.items.length - 1}</span>}
              </div>
              
              <div>
                <div className='mb-4 space-y-1'>
                  {order.items.map((item, i) => (
                    <p className='text-sm font-bold text-gray-800' key={i}>• {item.name} x {item.quantity} <span className='text-blue-600 font-black text-[10px] ml-1 bg-blue-50 px-2 py-0.5 rounded-md uppercase'>{item.size}</span></p>
                  ))}
                </div>
                <p className='font-black uppercase text-sm text-gray-900'>{order.address.firstName} {order.address.lastName}</p>
                <div className='text-gray-500 text-xs font-medium'>
                  <p>{order.address.city}, {order.address.state}</p>
                  <div className='mt-2 flex items-center gap-2'>
                    <p className='font-black text-gray-900'>{order.address.phone}</p>
                    <button onClick={() => openWhatsApp(order.address.phone, order.address.firstName, order.status, order._id)} className='p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm'><HiChatAlt2 className='text-lg' /></button>
                  </div>
                </div>
              </div>

              <div className='text-sm font-bold text-gray-500'>
                <p>Items: <span className='text-black font-black'>{order.items.length}</span></p>
                <p className='mt-2'>Method: <span className='uppercase text-[10px] font-black px-2 py-1 bg-gray-100 rounded-lg text-gray-700'>{order.paymentMethod}</span></p>
                <p className='mt-2 text-xs'>ID: <span className='text-[8px] font-mono text-blue-500'>{order._id}</span></p>
              </div>

              <p className={`text-2xl font-black tracking-tighter ${order.status === 'Cancelled' ? 'text-gray-400 line-through' : 'text-black'}`}>{currency}{order.amount.toLocaleString()}</p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className={`p-4 font-black text-xs uppercase border-2 rounded-2xl outline-none cursor-pointer ${order.status === 'Cancelled' ? 'bg-red-100 border-red-300 text-red-600' : 'bg-white border-gray-100 focus:border-black'}`}>
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
          <div className='text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200'><p className='text-gray-400 font-black uppercase tracking-widest'>No orders found yet</p></div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;