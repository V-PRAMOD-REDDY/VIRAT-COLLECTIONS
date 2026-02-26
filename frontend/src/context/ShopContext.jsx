import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [search, setSearch] = useState("");

  const currency = "₹";
  const delivery_fee = 50;

  // ✅ SAFE BACKEND URL
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "https://virat-collections.onrender.com";

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("PRODUCT FETCH ERROR ❌", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [backendUrl]);

  const getCartCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else {
      localStorage.removeItem("token");
      setCart([]);
    }
  }, [token]);

  return (
    <ShopContext.Provider
      value={{
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
        getCartCount,
        getProductsData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;