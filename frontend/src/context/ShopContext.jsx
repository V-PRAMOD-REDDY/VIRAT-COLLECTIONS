import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [search, setSearch] = useState('');

  const currency = '₹';
  const delivery_fee = 50;

  // ✅ LIVE BACKEND
  const backendUrl = 'https://virat-collections.onrender.com';

  // ✅ GET CART COUNT (🔥 FIXED)
  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // ✅ FETCH PRODUCTS
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Database connection failed!');
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setCart([]);
    }
  }, [token]);

  // ✅ CONTEXT VALUE (🔥 getCartCount added)
  const value = {
    products,
    currency,
    delivery_fee,
    cart,
    setCart,
    token,
    setToken,
    backendUrl,
    search,
    setSearch,
    getCartCount
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;