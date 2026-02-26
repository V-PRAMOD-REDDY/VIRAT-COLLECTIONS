import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiStar, HiOutlineStar, HiOutlineHeart, HiHeart, HiOutlineShare } from 'react-icons/hi';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]); 

  const fetchProductData = async () => {
    const item = products.find((item) => item._id === productId);
    if (item) { setProductData(item); setImage(item.image[0]); window.scrollTo(0, 0); }
  }

  useEffect(() => { fetchProductData(); }, [productId, products]);

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) setSelectedSizes(prev => prev.filter(i => i !== size));
    else setSelectedSizes(prev => [...prev, size]);
  }

  const handleAction = async (isBuyNow) => {
    if (!token) { toast.error("Please Login!"); navigate('/login'); return; }
    if (selectedSizes.length === 0) { toast.error("Please Select Size!"); return; }
    for (const size of selectedSizes) { await addToCart(productData._id, size); }
    if (isBuyNow) navigate('/cart');
    else { toast.success("Added to Bag! 🛍️"); setSelectedSizes([]); }
  }

  return productData ? (
    <div className='border-t-2 pt-10 px-4 md:px-10 pb-20 bg-white'>
      <div className='flex gap-12 flex-col lg:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:w-[18.7%] w-full scrollbar-hide'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className={`w-[23%] sm:w-full sm:mb-3 cursor-pointer rounded-xl border-2 p-1 transition-all ${item === image ? 'border-black' : 'border-transparent opacity-60'}`} alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%] relative overflow-hidden rounded-2xl'>
            <img className={`w-full h-auto rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 hover:scale-105 ${productData.inStock === false ? 'opacity-40 grayscale blur-[1px]' : ''}`} src={image} alt="" />
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-black text-3xl md:text-4xl mt-2 uppercase text-gray-900'>{productData.name}</h1>
          <p className='mt-8 text-4xl font-black text-black'>{currency}{Number(productData.price).toLocaleString('en-IN')}</p>
          <p className='mt-6 text-gray-500 md:w-4/5 text-sm'>{productData.description}</p>
          
          <div className='flex flex-col gap-4 my-8'>
            <p className='font-black uppercase text-[10px] tracking-[0.2em] text-gray-400'>Select Sizes</p>
            <div className='flex gap-3 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button key={index} onClick={() => toggleSize(item)} className={`w-14 h-14 border-2 rounded-2xl font-black transition-all ${selectedSizes.includes(item) ? 'border-black bg-black text-white scale-110 shadow-xl' : 'bg-gray-50 border-gray-100'}`}>{item}</button>
              ))}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-4/5 mt-10'>
            <button onClick={() => handleAction(false)} className='flex-1 bg-white text-black border-2 border-black px-8 py-5 text-xs font-black rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all uppercase'>Add to Bag</button>
            <button onClick={() => handleAction(true)} className='flex-1 bg-orange-600 text-white px-8 py-5 text-xs font-black rounded-2xl shadow-xl hover:bg-orange-700 transition-all uppercase'>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  ) : <div className='h-screen flex items-center justify-center font-black animate-pulse'>Loading...</div>
}

export default ProductDetail;