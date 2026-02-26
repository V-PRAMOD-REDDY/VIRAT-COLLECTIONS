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
  // లైవ్ బ్యాకెండ్ URL
  const backendUrl = "https://virat-collections.onrender.com";

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Database connection failed!");
    }
  }

  // ఇతర ఫంక్షన్లు (addToCart, updateQuantity, etc.) మీ పాత కోడ్ లాగే ఉంచండి...

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

  const value = {
    products, currency, delivery_fee,
    cart, setCart, token, setToken, 
    backendUrl, search, setSearch 
    // పైన backendUrl ఖచ్చితంగా ఉండాలి
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;