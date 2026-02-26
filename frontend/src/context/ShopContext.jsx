import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({}); // క్లారిటీ కోసం cartItems గా మార్చాను
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [search, setSearch] = useState("");

  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://virat-collections.onrender.com";

  // --- 1. ఉత్పత్తుల డేటాను పొందడం ---
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

  // --- 2. కార్ట్‌కు యాడ్ చేయడం (ఇది చాలా ముఖ్యం) ---
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Size First!");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Bag! 🛍️");

    // లాగిన్ అయి ఉంటే బ్యాకెండ్‌లో కూడా అప్‌డేట్ చేస్తుంది
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // --- 3. కార్ట్ కౌంట్ లెక్కించడం ---
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalCount += cartItems[items][size];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  // --- 4. యూజర్ కార్ట్ డేటాను బ్యాకెండ్ నుండి పొందడం ---
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [backendUrl]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart(token);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  const value = {
    products, currency, delivery_fee,
    cartItems, setCartItems, addToCart,
    getCartCount, token, setToken,
    backendUrl, search, setSearch, getProductsData
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;