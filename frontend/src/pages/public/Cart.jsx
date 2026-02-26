import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiOutlineTrash, HiPlus, HiMinus, HiOutlineShoppingBag } from 'react-icons/hi';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount, delivery_fee } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

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

  const subtotal = getCartAmount();
  const shippingFee = subtotal > 1999 || subtotal === 0 ? 0 : Number(delivery_fee);
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen pb-24 md:pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-tight">Your Cart</h1>

      {cartData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <HiOutlineShoppingBag className="text-6xl text-gray-200 mb-4" />
          <p className="text-xl text-gray-500 mb-6 font-medium">Your cart is currently empty 🥲</p>
          <Link to="/shop" className="bg-black text-white font-bold py-4 px-10 rounded-xl hover:bg-gray-800 transition shadow-lg inline-block uppercase tracking-widest text-xs">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="border-t border-gray-200">
              {cartData.map((item, index) => {
                const productData = products.find((p) => p._id === item._id);
                if (!productData) return null;

                return (
                  <div key={index} className="flex py-6 border-b border-gray-200 group items-center">
                    <div className="h-24 w-20 sm:h-32 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border">
                      <img src={productData.image[0]} alt="" className="h-full w-full object-cover" />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <h3 className="uppercase tracking-tight text-sm sm:text-base">{productData.name}</h3>
                        <p className="ml-4">{currency}{productData.price.toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Size: <span className="text-black bg-gray-100 px-2 py-0.5 rounded ml-1">{item.size}</span>
                      </p>
                      
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="p-2 hover:bg-gray-100 text-gray-600"><HiMinus className="text-xs" /></button>
                          <span className="px-4 py-1 font-black text-gray-900 border-x border-gray-100">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-600"><HiPlus className="text-xs" /></button>
                        </div>
                        <button onClick={() => updateQuantity(item._id, item.size, 0)} className="p-2 text-gray-400 hover:text-red-600 transition-all"><HiOutlineTrash className="text-2xl" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-6 border-b pb-4 uppercase tracking-widest">Order Summary</h2>
              <div className="flex justify-between text-sm mb-4">
                <p className="text-gray-500 font-bold uppercase text-xs">Subtotal</p>
                <p className="font-black text-gray-900">{currency}{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <p className="text-gray-500 font-bold uppercase text-xs">Shipping</p>
                <p className={`font-black ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shippingFee === 0 ? 'FREE' : `${currency}${shippingFee}`}</p>
              </div>
              <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between text-xl font-black text-gray-900 mb-8">
                <p className="uppercase tracking-tighter">Total</p>
                <p>{currency}{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={() => navigate('/place-order')} className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:bg-gray-800 transition uppercase tracking-widest text-sm">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;