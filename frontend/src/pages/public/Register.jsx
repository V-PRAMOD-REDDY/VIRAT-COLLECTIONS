import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // backendUrl సరిగ్గా అందుతుందో లేదో ఇక్కడ axios చెక్ చేస్తుంది
            const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Account Created Successfully! 🎉");
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed!");
        }
    }

    return (
        <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-20">
            <form onSubmit={onSubmitHandler} className="w-full flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-2 mb-2 mt-10">
                    <p className="text-3xl font-bold">Sign Up</p>
                    <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
                </div>
                <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Name" className="w-full px-4 py-2 border border-gray-800 rounded outline-none" required />
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-800 rounded outline-none" required />
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="w-full px-4 py-2 border border-gray-800 rounded outline-none" required />
                <button className="bg-black text-white font-bold px-8 py-3 mt-4 w-full rounded-lg active:scale-95 transition-all">SIGN UP</button>
                <p onClick={()=>navigate('/login')} className="cursor-pointer text-blue-600 text-sm hover:underline">Already have an account? Login Here</p>
            </form>
        </div>
    );
};

export default Register;