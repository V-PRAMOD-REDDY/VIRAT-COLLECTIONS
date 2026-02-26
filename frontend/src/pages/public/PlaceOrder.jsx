import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../../context/ShopContext";
import { toast } from 'react-toastify';
import axios from 'axios';
import Title from "../../components/Title";
import CartTotal from "../../components/CartTotal";

const PlaceOrder = () => {
  const {
    cartItems,
    getCartAmount,
    delivery_fee,
    token,
    backendUrl,
    setCartItems,
    products
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [method, setMethod] = useState('cod'); // Default 'cod'
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!cartItems || Object.keys(cartItems).length === 0) {
      return toast.error("Your cart is empty!");
    }

    let orderItems = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size];
        if (qty > 0) {
          const product = products.find(p => p._id === productId);
          if (product) {
            orderItems.push({ ...product, size, quantity: qty });
          }
        }
      }
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee
    };

    try {
      if (method === 'cod') {
        // COD ఆర్డర్ లాజిక్
        const res = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
        if (res.data.success) {
          setCartItems({});
          toast.success("Order Placed (COD) 🎉");
          navigate('/orders');
        } else {
          toast.error(res.data.message);
        }
      } else if (method === 'razorpay') {
        // ఇక్కడ మీ Razorpay ఫంక్షనాలిటీని పిలవాలి
        toast.info("Razorpay Payment Gateway loading...");
        // API call for online payment goes here
      }
    } catch (err) {
      toast.error("Order failed. Try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-10 px-4 md:px-16 pt-10 bg-white border-t pb-20">

      {/* LEFT SIDE: Delivery Info */}
      <div className="w-full sm:max-w-[480px] flex flex-col gap-4">
        <div className='text-xl sm:text-2xl my-3'>
            <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First Name" className="border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black transition-all" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last Name" className="border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black" />
        </div>

        <input required name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email" className="border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black" />
        <input required name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street" className="border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className="border border-gray-100 rounded-xl py-2.5 px-4 w-full font-bold" />
          <input required name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" className="border border-gray-100 rounded-xl py-2.5 px-4 w-full font-bold" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} placeholder="Zipcode" className="border border-gray-100 rounded-xl py-2.5 px-4 w-full font-bold" />
          <input required name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className="border border-gray-100 rounded-xl py-2.5 px-4 w-full font-bold" />
        </div>

        <input required name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone" className="border border-gray-100 rounded-xl py-2.5 px-4 w-full font-bold" />
      </div>

      {/* RIGHT SIDE: Summary & Payment Selection */}
      <div className="flex-1">
        <div className='min-w-80'>
            <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          {/* Payment Method Selection Boxes */}
          <div className="flex gap-3 flex-col lg:flex-row mt-4">
            
            {/* Razorpay Option */}
            <div onClick={() => setMethod('razorpay')}
              className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl transition-all ${method === 'razorpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
              <p className={`min-w-4 h-4 border rounded-full ${method === 'razorpay' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}></p>
              <div className="flex flex-col">
                <p className='text-black text-[10px] font-black uppercase tracking-widest'>Online Payment</p>
                <p className='text-gray-400 text-[8px] font-bold uppercase'>Razorpay / Card / UPI</p>
              </div>
            </div>

            {/* COD Option */}
            <div onClick={() => setMethod('cod')}
              className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl transition-all ${method === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}>
              <p className={`min-w-4 h-4 border rounded-full ${method === 'cod' ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}></p>
              <div className="flex flex-col">
                <p className='text-black text-[10px] font-black uppercase tracking-widest'>Cash on Delivery</p>
                <p className='text-gray-400 text-[8px] font-bold uppercase'>Pay at your doorstep</p>
              </div>
            </div>

          </div>

          {/* Place Order Button */}
          <div className="text-end mt-10">
            <button type='submit' className="w-full md:w-64 bg-black text-white py-4 rounded-2xl text-xs font-black hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-widest shadow-2xl">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;