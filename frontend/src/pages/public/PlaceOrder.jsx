import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../../context/ShopContext"; 
import { toast } from 'react-toastify';
import axios from 'axios';
import Title from "../../components/Title"; 
import CartTotal from "../../components/CartTotal";

const PlaceOrder = () => {
    const { cart, getCartTotal, delivery_fee, token, backendUrl, setCart } = useContext(ShopContext);
    const navigate = useNavigate(); 
    
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    });

    // 1. ప్రొఫైల్ వివరాలను ఆటోమేటిక్ గా ఫిల్ చేయడం
    const fetchUserProfile = async () => {
        if (!token) return;
        try {
            // మీ బ్యాకెండ్ రూట్ కు అనుగుణంగా మార్చబడింది
            const response = await axios.post(backendUrl + '/api/user/get-profile', {}, { headers: { token } });
            
            if (response.data.success) {
                const { name, email, address, phone } = response.data.user;
                setFormData(prev => ({
                    ...prev,
                    firstName: name?.split(' ')[0] || '',
                    lastName: name?.split(' ')[1] || '',
                    email: email || '',
                    street: address?.street || '',
                    city: address?.city || '',
                    state: address?.state || '',
                    zipcode: address?.zipcode || '',
                    country: address?.country || '',
                    phone: phone || ''
                }));
            }
        } catch (error) {
            console.log("Profile fetch error:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [token]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // 2. కార్ట్ ఖాళీగా ఉందో లేదో తనిఖీ
            if (cart.length === 0) {
                return toast.error("Your cart is empty! 🛒");
            }

            const totalAmount = getCartTotal();
            
            // బ్యాకెండ్ కి పంపాల్సిన డేటా స్ట్రక్చర్
            let orderData = {
                address: formData,
                items: cart, // ShopContext లో ఉన్న Array ని నేరుగా పంపుతున్నాం
                amount: totalAmount + delivery_fee
            }

            // 3. ఆర్డర్ ప్లేస్ చేయడం
            if (method === 'cod') {
                const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
                
                if (response.data.success) {
                    setCart([]); // ఫ్రంటెండ్ కార్ట్ క్లియర్ చేయడం
                    navigate('/orders'); 
                    toast.success("Order Placed Successfully! 🎉");
                } else {
                    toast.error(response.data.message);
                }
            } else {
                toast.info("Online Payment integration coming soon!");
            }
        } catch (error) {
            console.error("Order Error:", error);
            toast.error("Something went wrong with the order.");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-10 pt-10 px-4 md:px-16 bg-white border-t'>
            
            {/* --- Left Side: Delivery Information --- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3 text-gray-900'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black' type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black' type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black' type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded-xl py-2.5 px-4 w-full font-bold outline-none focus:border-black' type="text" placeholder='Street' />
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

            {/* --- Right Side: Summary & Payment --- */}
            <div className='mt-8 flex-1'>
                <div className='min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row mt-4'>
                         <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl transition-all ${method === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-blue-500 border-blue-500' : ''}`}></p>
                             <p className='text-gray-500 text-xs font-black uppercase tracking-widest'>Online Payment</p>
                         </div>
                         <div onClick={() => setMethod('cod')} className={`flex items-center gap-4 border p-3 px-5 cursor-pointer rounded-2xl transition-all ${method === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}>
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500 border-green-500' : ''}`}></p>
                             <p className='text-gray-500 text-xs font-black uppercase tracking-widest'>Cash on Delivery</p>
                         </div>
                    </div>

                    <div className='w-full text-end mt-10'>
                        <button type='submit' className='bg-black text-white px-16 py-4 rounded-2xl text-xs font-black hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-widest shadow-xl'>
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PlaceOrder;