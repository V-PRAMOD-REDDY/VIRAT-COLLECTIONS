import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiOutlineTrash, HiPlus, HiMinus, HiOutlineShoppingBag } from 'react-icons/hi';

const Cart = () => {
  const { cart, updateQuantity, getCartTotal, currency, delivery_fee } = useContext(ShopContext);
  const navigate = useNavigate();

  // అమౌంట్ క్యాలిక్యులేషన్ - NaN రాకుండా Number() కన్వర్షన్
  const subtotal = Number(getCartTotal()) || 0;
  const shippingFee = subtotal > 1999 || subtotal === 0 ? 0 : Number(delivery_fee);
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen pb-24 md:pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-tight">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <HiOutlineShoppingBag className="text-6xl text-gray-200 mb-4" />
          <p className="text-xl text-gray-500 mb-6 font-medium">Your cart is currently empty 🥲</p>
          <Link to="/shop" className="bg-black text-white font-bold py-4 px-10 rounded-xl hover:bg-gray-800 transition shadow-lg inline-block uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-2/3">
            <div className="border-t border-gray-200">
              {cart.map((item, index) => (
                <div key={index} className="flex py-6 border-b border-gray-200 group items-center">
                  {/* Image Fix: Array లో ఉన్న మొదటి ఇమేజ్ తీసుకుంటుంది */}
                  <div className="h-24 w-20 sm:h-32 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border">
                    <img 
                      src={Array.isArray(item.image) ? item.image[0] : (item.image || item.img)} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <h3 className="uppercase tracking-tight text-sm sm:text-base">{item.name}</h3>
                        {/* Price NaN Fix */}
                        <p className="ml-4">{currency || '₹'}{(Number(item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Size: <span className="text-black bg-gray-100 px-2 py-0.5 rounded ml-1">{item.size}</span>
                      </p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                        <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors text-gray-600">
                          <HiMinus className="text-xs" />
                        </button>
                        <span className="px-4 py-1 font-black text-gray-900 border-x border-gray-100">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors text-gray-600">
                          <HiPlus className="text-xs" />
                        </button>
                      </div>

                      <button onClick={() => updateQuantity(item._id, item.size, 0)} className="p-2 text-gray-400 hover:text-red-600 transition-all transform hover:scale-110">
                        <HiOutlineTrash className="text-2xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary (Light Theme) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6 border-b pb-4 uppercase tracking-widest">Order Summary</h2>
              
              <div className="flex justify-between text-sm mb-4">
                <p className="text-gray-500 font-bold uppercase text-xs">Subtotal</p>
                <p className="font-black text-gray-900">{currency || '₹'}{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <p className="text-gray-500 font-bold uppercase text-xs">Shipping</p>
                <p className={`font-black ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingFee === 0 ? 'FREE' : `${currency || '₹'}${shippingFee}`}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between text-xl font-black text-gray-900 mb-8">
                <p className="uppercase tracking-tighter">Total</p>
                <p>{currency || '₹'}{totalAmount.toLocaleString()}</p>
              </div>

              <button onClick={() => navigate('/place-order')} className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:bg-gray-800 transition transform active:scale-95 uppercase tracking-widest text-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;