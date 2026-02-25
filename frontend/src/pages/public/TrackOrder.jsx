import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { backendUrl, currency } = useContext(ShopContext);

    const onTrackHandler = async (e) => {
        e.preventDefault();
        if (!orderId) {
            return toast.error("Please enter a valid Order ID");
        }

        setLoading(true);
        try {
            // బ్యాకెండ్ నుండి ఆర్డర్ వివరాలను పొందడం
            const response = await axios.post(backendUrl + '/api/order/status', { orderId });
            
            if (response.data.success) {
                setOrderData(response.data.order);
                toast.success("Order details fetched!");
            } else {
                setOrderData(null);
                toast.error(response.data.message || "Order not found");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching order status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='border-t pt-16 px-4 md:px-10 min-h-[70vh] bg-white'>
            <div className='max-w-2xl mx-auto'>
                <div className='text-center mb-10'>
                    <h2 className='text-3xl font-black uppercase tracking-tighter text-gray-900'>
                        Track Your <span className='text-gray-400'>Order</span>
                    </h2>
                    <p className='text-gray-500 mt-2 text-sm'>Enter your Order ID to see the current status and details.</p>
                </div>

                <form onSubmit={onTrackHandler} className='flex flex-col sm:flex-row gap-3 mb-10'>
                    <input 
                        type="text" 
                        placeholder='Enter Order ID (e.g. 699c5...)' 
                        className='border-2 border-gray-100 rounded-2xl px-5 py-4 w-full focus:border-black outline-none transition-all font-mono text-sm shadow-sm'
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='bg-black text-white px-10 py-4 rounded-2xl font-black uppercase hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:bg-gray-400'
                    >
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>

                {/* ఆర్డర్ స్టేటస్ రిజల్ట్ సెక్షన్ */}
                {orderData && (
                    <div className='bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm animate-fadeIn'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b pb-6'>
                            <div className='text-center md:text-left'>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Status</p>
                                <div className='flex items-center gap-2 justify-center md:justify-start mt-1'>
                                    <p className={`w-3 h-3 rounded-full ${orderData.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></p>
                                    <h3 className='text-2xl font-black uppercase text-gray-900'>{orderData.status}</h3>
                                </div>
                            </div>
                            <div className='text-center md:text-right'>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Order Date</p>
                                <p className='text-gray-700 font-bold mt-1'>{new Date(orderData.date).toDateString()}</p>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <p className='text-sm font-black uppercase text-gray-400'>Items in this order</p>
                            {orderData.items.map((item, index) => (
                                <div key={index} className='flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50'>
                                    <img 
                                        className='w-12 h-12 rounded-xl object-cover border' 
                                        src={item.image?.[0] || 'https://placehold.co/100x100?text=Virat'} 
                                        alt={item.name} 
                                    />
                                    <div className='flex-1'>
                                        <p className='text-sm font-bold text-gray-900 uppercase'>{item.name}</p>
                                        <p className='text-xs text-gray-500'>Qty: {item.quantity} | Size: {item.size}</p>
                                    </div>
                                    <p className='font-bold text-sm'>{currency}{item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className='mt-8 pt-6 border-t flex justify-between items-center'>
                            <p className='text-gray-500 font-bold uppercase text-xs'>Payment: {orderData.paymentMethod}</p>
                            <p className='text-lg font-black text-gray-900'>Total: {currency}{orderData.amount}</p>
                        </div>
                    </div>
                )}

                {!orderData && !loading && (
                    <div className='text-center py-10 opacity-30 uppercase font-black tracking-widest text-gray-400'>
                        Awaiting Order ID
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;