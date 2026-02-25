import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiStar, HiOutlineStar, HiOutlineHeart, HiHeart, HiOutlineShare } from 'react-icons/hi';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const fetchProductData = async () => {
    const item = products.find((item) => item._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productData.name,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleBuyNow = async () => {
    if (!size) {
      toast.error("Please Select Size First!");
      return;
    }
    // కార్ట్ లో NaN రాకుండా మొత్తం ఆబ్జెక్ట్ పంపుతున్నాం
    await addToCart(productData, size);
    navigate('/cart');
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 px-4 md:px-10 pb-20 bg-white'>
      <div className='flex gap-12 flex-col lg:flex-row'>
        
        {/* Images Section */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full scrollbar-hide'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg border-2 p-1 transition-all ${item === image ? 'border-black' : 'border-transparent opacity-60'}`} 
                alt="Thumbnail" 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%] relative group'>
            <img 
                className={`w-full h-auto rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 ${productData.inStock === false ? 'opacity-40 grayscale blur-[1px]' : ''}`} 
                src={image} 
                alt="Main Product" 
            />
            {productData.inStock === false && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                    <p className='bg-white/90 backdrop-blur-md text-red-600 px-6 py-3 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl border border-red-100 text-xs'>
                        Out of Stock
                    </p>
                </div>
            )}
            <div className='absolute top-4 right-4 flex flex-col gap-3'>
              <button onClick={() => { setIsLiked(!isLiked); isLiked ? toast.info("Removed from Wishlist") : toast.success("Added to Wishlist!"); }} className='p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:scale-110 transition-all'>
                {isLiked ? <HiHeart className='text-2xl text-red-500' /> : <HiOutlineHeart className='text-2xl' />}
              </button>
              <button onClick={handleShare} className='p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:scale-110 transition-all'>
                <HiOutlineShare className='text-2xl' />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className='flex-1'>
          <h1 className='font-black text-3xl mt-2 uppercase tracking-tight text-gray-900'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-3'>
            <div className='flex text-[#FFAD33] text-xl'><HiStar /><HiStar /><HiStar /><HiStar /><HiOutlineStar className='text-gray-300' /></div>
            <p className='pl-2 text-gray-400 text-sm font-medium'>(122 Reviews)</p>
          </div>
          <p className={`mt-6 text-4xl font-black ${productData.inStock === false ? 'text-gray-300 line-through' : 'text-black'}`}>
            {currency}{Number(productData.price).toLocaleString()}
          </p>
          <p className='mt-6 text-gray-500 md:w-4/5 leading-relaxed text-sm font-medium'>{productData.description}</p>
          
          <div className='flex flex-col gap-4 my-8'>
            <p className='font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400'>Select Size</p>
            <div className='flex gap-3'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  key={index} 
                  disabled={productData.inStock === false}
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl font-black transition-all ${productData.inStock === false ? 'opacity-20 cursor-not-allowed' : item === size ? 'border-black bg-black text-white scale-110 shadow-lg' : 'bg-gray-50 border-gray-100 hover:border-gray-300'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-4/5 mt-8'>
            {productData.inStock !== false ? (
              <>
                <button onClick={() => { if(!size) { toast.error("Please Select Size!"); return; } addToCart(productData, size); }} className='flex-1 bg-black text-white px-8 py-5 text-xs font-black active:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest'>
                  Add to Bag
                </button>
                <button onClick={handleBuyNow} className='flex-1 bg-orange-600 text-white px-8 py-5 text-xs font-black active:bg-orange-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest'>
                  Buy Now
                </button>
              </>
            ) : (
              <button disabled className='w-full bg-gray-100 text-gray-400 px-8 py-5 text-xs font-black rounded-2xl border-2 border-gray-200 cursor-not-allowed uppercase tracking-widest'>
                Sold Out / Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : <div className='h-screen flex items-center justify-center font-black uppercase animate-pulse tracking-widest text-gray-400'>Loading Details...</div>
}

export default ProductDetail;