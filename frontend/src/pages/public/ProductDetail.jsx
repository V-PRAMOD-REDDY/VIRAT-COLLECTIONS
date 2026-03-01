import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiStar, HiOutlineStar, HiOutlineHeart, HiHeart, HiOutlineShare, HiPlus, HiMinus, HiCheck, HiTruck, HiShieldCheck, HiRefresh } from 'react-icons/hi';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(''); 
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = async () => {
    const item = products.find((item) => item._id === productId);
    if (item) { 
      setProductData(item); 
      setImage(item.image[0]); 
      setSelectedSize('');
      setQuantity(1);
      window.scrollTo(0, 0); 
    }
  }

  useEffect(() => { fetchProductData(); }, [productId, products]);

  const selectSize = (size) => {
    setSelectedSize(size);
  }

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  }

  const toggleWishlist = () => {
    if (!token) {
      toast.error("Please login to add to wishlist!");
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  }

  const handleAddToCart = async () => {
    if (!token) { toast.error("Please Login!"); navigate('/login'); return; }
    if (!selectedSize) { toast.error("Please Select Size!"); return; }
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      await addToCart(productData._id, selectedSize);
    }
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to Bag! 🛍️`);
  }

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  }

  return productData ? (
    <div className='border-t-2 pt-10 px-4 md:px-10 pb-20 bg-white'>
      <div className='flex gap-12 flex-col lg:flex-row'>
        {/* Image Section */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:w-[18.7%] w-full scrollbar-hide'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className={`w-[23%] sm:w-full sm:mb-3 cursor-pointer rounded-xl border-2 p-1 transition-all ${item === image ? 'border-black' : 'border-transparent opacity-60'}`} alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%] relative overflow-hidden rounded-2xl'>
            <img className={`w-full h-auto rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 hover:scale-105 ${productData.inStock === false ? 'opacity-40 grayscale blur-[1px]' : ''}`} src={image} alt="" />
            <button 
              onClick={toggleWishlist}
              className='absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all'
            >
              {isWishlisted ? <HiHeart className='text-red-500 text-xl' /> : <HiOutlineHeart className='text-gray-600 text-xl' />}
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-bold'>BESTSELLER</span>
            <div className='flex items-center gap-1'>
              <div className='flex text-yellow-400'>
                {[...Array(4)].map((_, i) => <HiStar key={i} />)}
                <HiOutlineStar />
              </div>
              <span className='text-sm text-gray-500'>(4.2) • 1.2k reviews</span>
            </div>
          </div>
          
          <h1 className='font-black text-3xl md:text-4xl mt-2 uppercase text-gray-900'>{productData.name}</h1>
          
          <div className='flex items-center gap-4 mt-4'>
            <p className='text-4xl font-black text-black'>{currency}{Number(productData.price).toLocaleString('en-IN')}</p>
            <div className='flex items-center gap-2'>
              <span className='text-lg line-through text-gray-400'>{currency}{Number(productData.price * 1.4).toLocaleString('en-IN')}</span>
              <span className='text-green-600 font-bold text-sm'>30% OFF</span>
            </div>
          </div>

          {/* Product Features */}
          <div className='flex flex-wrap gap-4 mt-6'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <HiTruck className='text-green-600' />
              <span>Free Delivery</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <HiRefresh className='text-blue-600' />
              <span>7 Day Return</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <HiShieldCheck className='text-purple-600' />
              <span>2 Year Warranty</span>
            </div>
          </div>
          
          {/* Size Selection */}
          <div className='flex flex-col gap-4 my-8'>
            <div className='flex items-center justify-between'>
              <p className='font-black uppercase text-[10px] tracking-[0.2em] text-gray-400'>Select Size</p>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className='text-xs text-blue-600 underline hover:text-blue-800'
              >
                Size Guide
              </button>
            </div>
            <div className='flex gap-3 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => selectSize(item)} 
                  className={`w-14 h-14 border-2 rounded-2xl font-black transition-all relative ${
                    selectedSize === item 
                      ? 'border-black bg-black text-white scale-110 shadow-xl' 
                      : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {item}
                  {selectedSize === item && (
                    <HiCheck className='absolute -top-1 -right-1 text-green-400 bg-white rounded-full text-xs' />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className='flex flex-col gap-4 my-8'>
            <p className='font-black uppercase text-[10px] tracking-[0.2em] text-gray-400'>Quantity</p>
            <div className='flex items-center gap-4'>
              <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm'>
                <button 
                  onClick={decreaseQuantity}
                  className='p-3 hover:bg-gray-100 text-gray-600 disabled:opacity-50'
                  disabled={quantity <= 1}
                >
                  <HiMinus className='text-sm' />
                </button>
                <span className='px-6 py-2 font-black text-gray-900 border-x border-gray-100 min-w-[60px] text-center'>{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className='p-3 hover:bg-gray-100 text-gray-600'
                >
                  <HiPlus className='text-sm' />
                </button>
              </div>
              <div className='text-sm text-gray-500'>
                <span className='font-semibold'>Total: {currency}{(Number(productData.price) * quantity).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-4/5 mt-10'>
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className='flex-1 bg-white text-black border-2 border-black px-8 py-5 text-xs font-black rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Add to Bag
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className='flex-1 bg-orange-600 text-white px-8 py-5 text-xs font-black rounded-2xl shadow-xl hover:bg-orange-700 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Buy Now
            </button>
          </div>

          {/* Product Information Tabs */}
          <div className='mt-12'>
            <div className='flex border-b border-gray-200'>
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                    activeTab === tab 
                      ? 'border-b-2 border-black text-black' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className='py-6'>
              {activeTab === 'description' && (
                <p className='text-gray-600 leading-relaxed'>{productData.description}</p>
              )}
              {activeTab === 'specifications' && (
                <div className='space-y-2'>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='font-semibold'>Material:</span>
                    <span>100% Cotton</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='font-semibold'>Care:</span>
                    <span>Machine Wash</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='font-semibold'>Fit:</span>
                    <span>Regular Fit</span>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className='space-y-4'>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <div className='flex text-yellow-400 text-sm'>
                          {[...Array(5)].map((_, i) => <HiStar key={i} />)}
                        </div>
                        <span className='font-semibold'>Excellent Quality!</span>
                      </div>
                      <span className='text-sm text-gray-500'>2 days ago</span>
                    </div>
                    <p className='text-gray-600 text-sm'>Great product, perfect fit and amazing quality. Highly recommended!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <div className='h-screen flex items-center justify-center font-black animate-pulse'>Loading...</div>
}

export default ProductDetail;