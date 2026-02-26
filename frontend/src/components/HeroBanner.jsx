import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext'; 
import hero_design from '../assets/hero_design.jpg'; 

const HeroBanner = () => {
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState(null);
  
  // ShopContext నుండి backendUrl తీసుకోవడం ద్వారా డైనమిక్ కనెక్షన్ కుదురుతుంది
  const { backendUrl } = useContext(ShopContext); 
  const apiUrl = backendUrl || "https://virat-collections.onrender.com"; 

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/get-banner`);
      if (response.data.success && response.data.banner) {
        setBannerData(response.data.banner);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      // API ఫెయిల్ అయితే bannerData null గానే ఉంటుంది, కాబట్టి Fallback ఇమేజ్ కనిపిస్తుంది
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [apiUrl]);

  return (
    <div className='relative w-full h-[70vh] md:h-[85vh] bg-[#f0f0f0] flex items-center overflow-hidden'>
      
      {/* --- Background Image Section --- */}
      <div className='absolute inset-0 z-0 flex justify-end'>
        <img 
          // bannerData.image ఉంటే క్లౌడినరీ ఫోటో, లేకపోతే assets ఫోల్డర్‌లోని hero_design.jpg వస్తుంది
          src={bannerData?.image || hero_design} 
          alt="Hero Model" 
          className='h-full w-full md:w-auto object-cover md:object-contain object-right animate-fadeIn'
          // ఒకవేళ అప్‌లోడ్ చేసిన ఇమేజ్ URL బ్రోకెన్ అయితే డీఫాల్ట్ ఇమేజ్‌ని చూపిస్తుంది
          onError={(e) => { e.target.src = hero_design; }} 
        />
      </div>

      {/* --- Content Section --- */}
      <div className='relative z-10 px-6 md:px-20 w-full md:w-1/2'>
        <p className='text-xs md:text-sm font-black tracking-[0.4em] text-blue-600 uppercase mb-4'>
          Discover the 2026 Collection
        </p>
        <h1 className='text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10 text-black drop-shadow-sm'>
          NEW SEASON <br /> 
          <span className='text-transparent border-text'>ARRIVALS</span>
        </h1>
        
        <div className='flex gap-4'>
          <button 
            onClick={() => navigate('/shop')}
            className='bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl active:scale-95'
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* CSS Fix: Console warnings రాకుండా ఉండటానికి ఈ పద్ధతి ఉత్తమం */}
      <style dangerouslySetInnerHTML={{ __html: `
        .border-text {
          -webkit-text-stroke: 1px black;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out;
        }
      `}} />
    </div>
  );
};

export default HeroBanner;