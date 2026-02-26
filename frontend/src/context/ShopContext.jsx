import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [search, setSearch] = useState("");

  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://virat-collections.onrender.com";

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("PRODUCT FETCH ERROR ❌", err);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Size First!");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) cartData[itemId][size] += 1;
      else cartData[itemId][size] = 1;
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
        toast.success("Added to Bag!");
      } catch (error) { toast.error(error.message); }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) { toast.error(error.message); }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) totalCount += cartItems[items][size];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) totalAmount += itemInfo.price * cartItems[items][size];
      }
    }
    return totalAmount;
  };

  useEffect(() => { getProductsData(); }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  // అన్ని ఫంక్షన్లను ఇక్కడ ఎగుమతి చేయడం ముఖ్యం
  const value = {
    products, currency, delivery_fee, cartItems, setCartItems, 
    addToCart, getCartCount, updateQuantity, getCartAmount,
    token, setToken, backendUrl, search, setSearch, getProductsData
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;