import React, { useContext, useEffect } from 'react'; 
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext'; 

// Common Components
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import About from './pages/public/About'; 
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/public/Cart';
import Login from './pages/public/Login';
import Profile from './pages/public/Profile'; 
import OrderTracking from './pages/public/OrderTracking';
import PlaceOrder from './pages/public/PlaceOrder';
import Register from './pages/public/Register';

// Protected Pages
import OrderSuccess from './pages/protected/OrderSuccess';
import MyOrders from './pages/protected/MyOrders';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import OrderManagement from './pages/admin/OrderManagement';
import EditProduct from './pages/admin/EditProduct';
import UpdateBanner from './pages/admin/UpdateBanner'; // ✅ IMPORTANT

function App() {
  const { token } = useContext(ShopContext); 
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // 🔐 Admin route protection
  useEffect(() => {
    if (isAdminRoute && !token) {
      navigate('/login');
    }
  }, [isAdminRoute, token, navigate]);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      
      {/* Navbar only for public pages */}
      {!isAdminRoute && <Navbar />}  

      <div className={`flex-1 ${!isAdminRoute ? "pb-24 md:pb-0" : ""}`}>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/place-order" element={<PlaceOrder />} />

          {/* ================= PROTECTED USER ROUTES ================= */}
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* ================= ADMIN ROUTES ================= */}
          {token && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="update-banner" element={<UpdateBanner />} /> {/* ✅ FIX */}
            </Route>
          )}

        </Routes>
      </div>

      {/* Footer only for public pages */}
      {!isAdminRoute && <Footer />} 
    </div>
  );
}

export default App;