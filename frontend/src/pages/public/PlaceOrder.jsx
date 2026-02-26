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
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
          if (!product) continue;

          orderItems.push({
            ...product,
            size,
            quantity: qty
          });
        }
      }
    }

    if (orderItems.length === 0) {
      return toast.error("Your cart is empty!");
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: (getCartAmount?.() || 0) + delivery_fee
    };

    try {
      if (method === 'cod') {
        const res = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (res.data.success) {
          setCartItems({});
          toast.success("Order Placed Successfully 🎉");
          navigate('/orders');
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.info("Online payment coming soon!");
      }
    } catch (err) {
      toast.error("Order failed. Try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row gap-10 px-4 md:px-16 pt-10 bg-white border-t">

      {/* LEFT */}
      <div className="w-full sm:max-w-[480px] flex flex-col gap-4">
        <Title text1="DELIVERY" text2="INFORMATION" />

        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First Name" className="input" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last Name" className="input" />
        </div>

        <input required name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email" className="input" />
        <input required name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street" className="input" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className="input" />
          <input required name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" className="input" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} placeholder="Zipcode" className="input" />
          <input required name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className="input" />
        </div>

        <input required name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone" className="input" />
      </div>

      {/* RIGHT */}
      <div className="flex-1">
        <CartTotal />

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex gap-3 mt-4">
            <div onClick={() => setMethod('cod')}
              className={`pay-box ${method === 'cod' && 'active'}`}>
              Cash on Delivery
            </div>
          </div>

          <div className="text-end mt-10">
            <button className="btn-primary">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;