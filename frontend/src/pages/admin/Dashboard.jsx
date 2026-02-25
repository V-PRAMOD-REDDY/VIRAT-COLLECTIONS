import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';

const Dashboard = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [stats, setStats] = useState({ 
    totalItems: 0,      // స్టోర్ లో ఉన్న మొత్తం ప్రోడక్ట్స్ సంఖ్య
    totalOrders: 0,     // వచ్చిన మొత్తం ఆర్డర్లు (Pending + Delivered)
    realizedRevenue: 0  // కేవలం డెలివరీ అయి, డబ్బులు వచ్చిన ఆదాయం
  });

  const fetchStats = async () => {
    if (!token) return;

    try {
      // 1. ప్రోడక్ట్స్ లిస్ట్ పొందడం
      const productRes = await axios.get(`${backendUrl}/api/product/list`);
      
      // 2. ఆర్డర్స్ లిస్ట్ పొందడం (దీనికి అడ్మిన్ టోకెన్ అవసరం)
      const orderRes = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });

      if (productRes.data.success && orderRes.data.success) {
        
        // 👈 COD లాజిక్: కేవలం 'Delivered' స్టేటస్ ఉన్న ఆర్డర్ల అమౌంట్ మాత్రమే కలపాలి
        const deliveredOrders = orderRes.data.orders.filter(order => order.status === 'Delivered');
        const revenue = deliveredOrders.reduce((acc, order) => acc + order.amount, 0);

        setStats({
          totalItems: productRes.data.products.length,
          totalOrders: orderRes.data.orders.length,
          realizedRevenue: revenue
        });
      }
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
      <h2 className='text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8 text-gray-800'>
        Admin Dashboard
      </h2>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        
        {/* 1. Realized Revenue: కేవలం డెలివరీ అయిన ఆదాయం */}
        <div className='bg-white p-8 rounded-3xl shadow-sm border-b-8 border-green-500'>
          <p className='text-gray-400 font-black uppercase text-xs tracking-widest mb-2'>Confirmed Revenue</p>
          <h3 className='text-4xl font-black text-gray-900 tracking-tighter'>
            ₹ {stats.realizedRevenue.toLocaleString()}
          </h3>
          <p className='text-[10px] text-green-600 font-bold mt-2 uppercase'>Only Delivered Orders</p>
        </div>

        {/* 2. Total Orders: వచ్చిన మొత్తం ఆర్డర్లు */}
        <div className='bg-white p-8 rounded-3xl shadow-sm border-b-8 border-blue-500'>
          <p className='text-gray-400 font-black uppercase text-xs tracking-widest mb-2'>Total Orders</p>
          <h3 className='text-4xl font-black text-gray-900 tracking-tighter'>
            {stats.totalOrders}
          </h3>
          <p className='text-[10px] text-blue-600 font-bold mt-2 uppercase'>Including Pending & COD</p>
        </div>

        {/* 3. Total Items: మీ స్టోర్ లో ఉన్న ప్రోడక్ట్స్ సంఖ్య */}
        <div className='bg-white p-8 rounded-3xl shadow-sm border-b-8 border-purple-500'>
          <p className='text-gray-400 font-black uppercase text-xs tracking-widest mb-2'>Inventory Items</p>
          <h3 className='text-4xl font-black text-gray-900 tracking-tighter'>
            {stats.totalItems}
          </h3>
          <p className='text-[10px] text-purple-600 font-bold mt-2 uppercase'>Live in Shop</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;