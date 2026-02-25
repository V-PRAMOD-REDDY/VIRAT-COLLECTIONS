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
  // ఇది పక్కాగా ఇక్కడే ఉండాలి
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

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
      if (response.data.success) {
        const cartData = response.data.cartData;
        let tempCart = [];
        for (const items in cartData) {
          for (const size in cartData[items]) {
            if (cartData[items][size] > 0) {
              const productInfo = products.find(p => p._id === items);
              if (productInfo) {
                tempCart.push({
                  ...productInfo,
                  size: size,
                  quantity: cartData[items][size]
                });
              }
            }
          }
        }
        setCart(tempCart);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addToCart = async (product, size) => {
    if (!size) {
      toast.error("Please select a size first!");
      return;
    }
    const formattedProduct = {
        ...product,
        price: Number(product.price) || 0
    };
    const existingItem = cart.find(item => item._id === product._id && item.size === size);
    let newCart = existingItem 
      ? cart.map(item => item._id === product._id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...formattedProduct, size, quantity: 1 }];
    setCart(newCart);
    toast.success("Added to cart!");
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId: product._id, size }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (id, size, quantity) => {
    let newCart = quantity <= 0 
      ? cart.filter(item => !(item._id === id && item.size === size))
      : cart.map(item => item._id === id && item.size === size ? { ...item, quantity: Number(quantity) } : item);
    setCart(newCart);
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId: id, size, quantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0; 
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (products.length > 0) getUserCart(token);
    } else {
      localStorage.removeItem('token');
      setCart([]);
    }
  }, [token, products]);

  const value = {
    products, currency, delivery_fee,
    cart, addToCart, getCartCount, updateQuantity, getCartTotal,
    token, setToken, backendUrl, setCart,
    search, setSearch 
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;