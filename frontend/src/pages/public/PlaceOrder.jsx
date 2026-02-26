import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../../context/ShopContext"; 
import { toast } from 'react-toastify';
import axios from 'axios';
import Title from "../../components/Title"; 
import CartTotal from "../../components/CartTotal";

const PlaceOrder = () => {
    const { cartItems, getCartAmount, delivery_fee, token, backendUrl, setCartItems, products } = useContext(ShopContext);
    const navigate = useNavigate(); 
    
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            let orderItems = [];
            for (const items in cartItems) {
                for (const size in cartItems[items]) {
                    if (cartItems[items][size] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = size;
                            itemInfo.quantity = cartItems[items][size];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            if (orderItems.length === 0) return toast.error("Your cart is empty!");

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            if (method === 'cod') {
                const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
                if (response.data.success) {
                    setCartItems({});
                    navigate('/orders'); 
                    toast.success("Order Placed Successfully! 🎉");
                } else {
                    toast.error(response.data.message);
                }
            } else {
                toast.info("Online Payment integration coming soon!");
            }
        } catch (error) {
            toast.error("Something went wrong with the order.");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-10 pt-10 px-4 md:px-16 bg-white border-t'>
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'><Title text1={'DELIVERY'} text2={'INFORMATION'} /></div>
                <div className='flex gap-3'>
                    <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none' type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none' type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="number" placeholder='Zipcode' />
                    <input required name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold' type="number" placeholder='Phone' />
            </div>

            <div className='mt-8 flex-1'>
                <div className='min-w-80'><CartTotal /></div>
                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row mt-4'>
                         <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl ${method === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-blue-500 border-blue-500' : ''}`}></p>
                             <p className='text-gray-500 text-xs font-black uppercase'>Online Payment</p>
                         </div>
                         <div onClick={() => setMethod('cod')} className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl ${method === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}>
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500 border-green-500' : ''}`}></p>
                             <p className='text-gray-500 text-xs font-black uppercase'>Cash on Delivery</p>
                         </div>
                    </div>
                    <div className='w-full text-end mt-10'>
                        <button type='submit' className='bg-black text-white px-16 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PlaceOrder;