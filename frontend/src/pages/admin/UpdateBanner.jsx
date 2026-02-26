import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { ShopContext } from '../../context/ShopContext';

const UpdateBanner = () => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(ShopContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Admin token missing!");
    if (!image) return toast.error("Please select an image first!");

    setLoading(true);
    const loadToast = toast.loading("Uploading Hero Banner...");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(`${backendUrl}/api/product/update-banner`, formData, { headers: { token } });

      if (response.data.success) {
        toast.update(loadToast, { render: "Hero Banner Updated Successfully! 📸", type: "success", isLoading: false, autoClose: 3000 });
        setImage(false);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.update(loadToast, { render: response.data.message, type: "error", isLoading: false });
      }
    } catch (err) {
      toast.update(loadToast, { render: "Upload failed!", type: "error", isLoading: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-8'>
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-2xl'>
        <h2 className='text-3xl font-black uppercase mb-2 text-blue-600 italic tracking-tighter'>Update Hero Banner</h2>
        
        {/* Creative Image Upload */}
        <div className='flex flex-col gap-3 w-full'>
          <p className='font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]'>Visual Presentation (16:9 Aspect Ratio)</p>
          <label htmlFor="banner-image" className='group relative cursor-pointer w-full h-64'>
            <div className={`w-full h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden
                ${!image ? 'border-gray-200 bg-gray-50 hover:border-blue-600 hover:bg-white' : 'border-blue-600 bg-white'}`}>
                
                {!image ? (
                    <div className='flex flex-col items-center gap-2 p-4 text-center'>
                        <div className='bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform'>
                             <img className='w-10' src={assets.upload_area} alt="" />
                        </div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600'>Click to Upload Banner Image</p>
                    </div>
                ) : (
                    <img className='w-full h-full object-cover transition-transform group-hover:scale-105' 
                         src={URL.createObjectURL(image)} alt="Preview" />
                )}
                
                {image && (
                    <div className='absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2rem]'>
                        <p className='text-white text-[10px] font-black uppercase tracking-widest'>Change Banner</p>
                    </div>
                )}
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="banner-image" accept="image/*" hidden />
          </label>
        </div>

        <button 
            type="submit" 
            disabled={loading} 
            className='w-full md:w-64 py-4 mt-6 bg-black text-white rounded-[2rem] hover:bg-blue-600 transition-all uppercase font-black text-xs tracking-[0.3em] shadow-2xl active:scale-95 disabled:bg-gray-400'
        >
          {loading ? "UPLOADING..." : "CONFIRM UPDATE"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBanner;