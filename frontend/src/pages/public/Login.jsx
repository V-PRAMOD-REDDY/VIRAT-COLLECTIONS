import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Context నుండి backendUrl ని తీసుకుంటున్నాం
  const { setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/google-login`, {
        token: credentialResponse.credential
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Google Login Success! 🚀");
        navigate('/'); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Google Login Failed!");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = email === "admin@viratcollections.com" ? '/api/user/admin' : '/api/user/login';
      const response = await axios.post(`${backendUrl}${url}`, { email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Logged In Successfully!");
        
        if (email === "admin@viratcollections.com") {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection Error");
    }
  }

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-20'>
      <form onSubmit={onSubmitHandler} className='w-full flex flex-col items-center gap-4'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='text-3xl font-bold'>Login</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-4 py-2 border border-gray-800 rounded outline-none' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-4 py-2 border border-gray-800 rounded outline-none' placeholder='Password' required />
        
        <div className='w-full flex justify-between text-sm mt-[-8px] font-medium'>
          <p className='cursor-pointer hover:underline'>Forgot password?</p>
          <p onClick={() => navigate('/register')} className='cursor-pointer text-blue-600 hover:underline'>Create account</p>
        </div>

        <button className='bg-black text-white font-bold px-8 py-3 mt-4 w-full rounded-lg active:scale-95 transition-all'>SIGN IN</button>
      </form>

      <div className='mt-6 flex flex-col items-center w-full'>
        <div className='flex items-center gap-2 w-full mb-6'>
          <hr className='flex-1 border-gray-300' />
          <p className='text-gray-500 text-sm'>OR</p>
          <hr className='flex-1 border-gray-300' />
        </div>

        {/* Google Login Component */}
        <GoogleOAuthProvider clientId="438912551996-ts7core36aqi8balmeqvc4raalucvv7j.apps.googleusercontent.com">
          <div className='w-full flex justify-center'>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Login Failed")}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  )
}

export default Login;