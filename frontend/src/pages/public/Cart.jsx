import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { HiOutlineTrash, HiPlus, HiMinus } from 'react-icons/hi';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount, delivery_fee } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            tempData.push({
              _id: items,
              size: size,
              quantity: cartItems[items][size]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8 uppercase">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          {cartData.map((item, index) => {
            const productData = products.find((p) => p._id === item._id);
            if (!productData) return null;
            return (
              <div key={index} className="flex py-6 border-b items-center">
                <img src={productData.image[0]} className="w-20 rounded-xl" alt="" />
                <div className="ml-4 flex-1">
                  <h3 className="font-bold uppercase text-sm">{productData.name}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase mt-1">Size: <span className="text-black">{item.size}</span></p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="p-2 px-3"><HiMinus /></button>
                      <span className="px-4 font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="p-2 px-3"><HiPlus /></button>
                    </div>
                    <button onClick={() => updateQuantity(item._id, item.size, 0)} className="text-gray-400 hover:text-red-600"><HiOutlineTrash size={24}/></button>
                  </div>
                </div>
                <p className="font-black">{currency}{(productData.price * item.quantity).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
        {/* CartTotal Component will go here */}
      </div>
    </div>
  );
};

export default Cart;