import React, { useContext, useEffect } from 'react'; 
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext'; 
// ఇతర ఇంపోర్ట్స్ అన్నీ అలాగే ఉంచండి...

function App() {
  const { token } = useContext(ShopContext); 
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // అడ్మిన్ పేజీలకు టోకెన్ లేకపోతే లాగిన్ కి పంపుతుంది
    if (isAdminRoute && !token) {
      navigate('/login');
    }
  }, [isAdminRoute, token, navigate]);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}  

      <div className={`flex-1 ${!isAdminRoute ? "pb-24 md:pb-0" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/track-order' element={<OrderTracking />} />
          <Route path="/place-order" element={<PlaceOrder />} />

          {/* Protected Routes */}
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Admin Routes - Token ఉంటేనే కనిపిస్తాయి */}
          {token && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> 
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
            </Route>
          )}
        </Routes>
      </div>

      {!isAdminRoute && <Footer />} 
    </div>
  );
}

export default App;