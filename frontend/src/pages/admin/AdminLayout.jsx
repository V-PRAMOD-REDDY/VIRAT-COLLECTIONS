import React, { useContext, useEffect } from 'react'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext'; 
// Lucide Icons ఇంపోర్ట్ చేయడం
import { LayoutDashboard, PlusCircle, ListOrdered, Image, ShoppingBag, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { token, setToken } = useContext(ShopContext); 
  const navigate = useNavigate();

  // సెక్యూరిటీ చెక్: టోకెన్ లేకపోతే అడ్మిన్ పేజీ లోపలికి రానివ్వకూడదు
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const logoutHandler = () => {
    setToken(''); 
    navigate('/login'); 
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f3f4f6] overflow-hidden">
      
      {/* 1. Sidebar Section (Desktop) */}
      <div className="w-full md:w-64 bg-white shadow-xl flex flex-col h-auto md:h-screen sticky top-0 z-10">
        
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-wider">
            Virat <span className="text-blue-600">Admin</span>
          </h2>
          <button onClick={logoutHandler} className="md:hidden p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-col flex-1 p-4 gap-3">
          <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/add-product" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            <PlusCircle size={20} />
            <span>Add Product</span>
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            <ListOrdered size={20} />
            <span>Product List</span>
          </NavLink>
          <NavLink to="/admin/update-banner" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Image size={20} />
            <span>Hero Banner</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            <ShoppingBag size={20} />
            <span>Orders</span>
          </NavLink>
        </div>

        <div className="hidden md:block p-4 border-t border-gray-100">
          <button onClick={logoutHandler} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-[1200px] mx-auto">
          <Outlet /> 
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation (Sari Chesina Code) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        
        {/* Logic: NavLink render props dwara isActive ni tesukuntunnam */}
        <NavLink to="/admin/dashboard" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
          {({isActive}) => (
            <>
              <LayoutDashboard size={22} strokeWidth={isActive ? 2.5 : 2} />
              <p className="text-[10px] font-black uppercase">Stats</p>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/add-product" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
          {({isActive}) => (
            <>
              <PlusCircle size={22} strokeWidth={isActive ? 2.5 : 2} />
              <p className="text-[10px] font-black uppercase">Add</p>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/products" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
          {({isActive}) => (
            <>
              <ListOrdered size={22} strokeWidth={isActive ? 2.5 : 2} />
              <p className="text-[10px] font-black uppercase">Items</p>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/orders" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
          {({isActive}) => (
            <>
              <ShoppingBag size={22} strokeWidth={isActive ? 2.5 : 2} />
              <p className="text-[10px] font-black uppercase">Orders</p>
            </>
          )}
        </NavLink>

      </div>
      
    </div>
  );
};

export default AdminLayout;