import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { ShopContext } from '../../context/ShopContext';

const UpdateBanner = () => {
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // ShopContext నుండి backendUrl మరియు token తీసుకుంటున్నాము
    const { backendUrl, token } = useContext(ShopContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // సెక్యూరిటీ చెక్: టోకెన్ లేకపోతే రిక్వెస్ట్ పంపదు
        if (!token) {
            return toast.error("Admin token missing! Please login again.");
        }

        if (!image) {
            return toast.error("Please select an image first!");
        }

        setLoading(true);
        const loadToast = toast.loading("Uploading Hero Banner...");

        try {
            const formData = new FormData();
            formData.append("image", image); 

            // localhost స్థానంలో డైనమిక్ backendUrl వాడుతున్నాము
            const response = await axios.post(
                `${backendUrl}/api/product/update-banner`, 
                formData, 
                { 
                    headers: { 
                        token: token,
                        "Content-Type": "multipart/form-data" 
                    } 
                }
            );

            if (response.data.success) {
                toast.update(loadToast, { 
                    render: "Hero Banner Updated Successfully! 📸", 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 3000 
                });
                setImage(false);
                
                // సక్సెస్ అయ్యాక మార్పులు కనిపించడానికి చిన్న డిలే తర్వాత రిఫ్రెష్
                setTimeout(() => {
                    window.location.reload(); 
                }, 2000);
            } else {
                toast.update(loadToast, { 
                    render: response.data.message, 
                    type: "error", 
                    isLoading: false, 
                    autoClose: 3000 
                });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.update(loadToast, { 
                render: error.response?.data?.message || "Server connection failed!", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-8'>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 max-w-2xl'>
                <h2 className='text-2xl font-black uppercase mb-2 text-blue-600 italic tracking-tighter'>Update Hero Banner</h2>
                <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]'>Desktop Model Image (Best Ratio 16:9)</p>
                
                <label htmlFor="banner-image" className='cursor-pointer w-full'>
                    <div className='relative group'>
                        <img 
                            className='w-full h-64 object-cover border-2 border-dashed border-gray-200 p-2 rounded-2xl group-hover:border-blue-600 transition-all shadow-sm' 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            alt="Upload Preview" 
                        />
                        {!image && (
                            <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl'>
                                <p className='text-xs font-black text-blue-600 uppercase tracking-widest'>Click to Select Image</p>
                            </div>
                        )}
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
                    className='w-full md:w-64 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 disabled:bg-gray-400 shadow-2xl mt-4'
                >
                    {loading ? 'UPLOADING...' : 'UPDATE BANNER'}
                </button>
            </form>
        </div>
    );
};

export default UpdateBanner;