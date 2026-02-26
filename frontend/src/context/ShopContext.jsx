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

  // ✅ BACKEND URL FROM ENV (FINAL & CORRECT)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ GET CART COUNT
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
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server not reachable');
    }
  };

  useEffect(() => {
    if (backendUrl) {
      getProductsData();
    }
  }, [backendUrl]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setCart([]);
    }
  }, [token]);

  // ✅ CONTEXT VALUE
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