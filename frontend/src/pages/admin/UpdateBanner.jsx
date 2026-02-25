import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const UpdateBanner = ({ token }) => {
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked!"); // బటన్ పనిచేస్తుందో లేదో తెలుస్తుంది

        if (!token) {
            console.log("Token missing!");
            return toast.error("Admin token missing! Please login again.");
        }

        if (!image) {
            return toast.error("Please select an image first!");
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", image); 

            console.log("Sending request to backend...");
            const response = await axios.post(
                "http://localhost:4000/api/product/update-banner", 
                formData, 
                { 
                    headers: { 
                        token: token,
                        "Content-Type": "multipart/form-data" 
                    } 
                }
            );

            console.log("Server Response:", response.data);

            if (response.data.success) {
                toast.success("Hero Banner Updated Successfully! 📸");
                setImage(false);
                // సక్సెస్ అయ్యాక పేజీని రిఫ్రెష్ చేయడానికి:
                window.location.reload(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Upload Error Detail:", error);
            toast.error(error.response?.data?.message || "Server connection failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-8'>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                <h2 className='text-xl font-black uppercase mb-2 text-blue-600'>Update Hero Banner Image</h2>
                <p className='text-gray-400 text-xs font-bold uppercase tracking-widest'>Select Model Image (Desktop Style)</p>
                
                <label htmlFor="banner-image" className='cursor-pointer'>
                    <div className='relative'>
                        <img 
                            className='w-80 h-48 object-cover border-2 border-dashed border-gray-200 p-2 rounded-2xl hover:border-black transition-all shadow-sm' 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            alt="Upload Preview" 
                        />
                        {!image && <p className='absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400'>CLICK TO UPLOAD</p>}
                    </div>
                    <input 
                        onChange={(e) => setImage(e.target.files[0])} 
                        type="file" 
                        id="banner-image" 
                        accept="image/*" 
                        hidden 
                    />
                </label>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className='w-48 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:bg-gray-400 shadow-lg mt-4'
                >
                    {loading ? 'Uploading...' : 'UPDATE BANNER'}
                </button>
            </form>
        </div>
    );
};

export default UpdateBanner;