import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link 
      onClick={() => window.scrollTo(0, 0)} 
      className='text-gray-700 cursor-pointer group' 
      to={`/product/${id}`}
    >
      {/* ప్రొడక్ట్ ఇమేజ్ సెక్షన్ */}
      <div className='overflow-hidden rounded-2xl bg-[#f9f9f9] relative border border-gray-100 shadow-sm'>
        <img 
          className='hover:scale-110 transition-all duration-500 ease-in-out w-full h-64 object-cover object-top' 
          src={image && image[0]} 
          alt={name} 
        />
        {/* Hover చేసినప్పుడు కనిపించే చిన్న 'View' బటన్ */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
            <button className='bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 uppercase'>
                Quick View
            </button>
        </div>
      </div>

      {/* ప్రొడక్ట్ వివరాలు */}
      <div className='pt-4 pb-1'>
        <p className='text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-1'>New Arrival</p>
        <h4 className='text-sm font-bold text-gray-800 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors'>
          {name}
        </h4>
        <div className='flex items-center justify-between mt-2'>
            <p className='text-base font-black text-black'>
                {currency}{price}.00
            </p>
            <button className='text-[10px] font-bold border-b-2 border-black hover:text-blue-600 hover:border-blue-600 transition-all uppercase'>
                Details
            </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;