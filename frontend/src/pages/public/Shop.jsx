import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { HiOutlineHeart, HiHeart, HiOutlineShare } from 'react-icons/hi';
import { toast } from 'react-toastify';

const Shop = () => {
  const { categoryId } = useParams(); 
  const { products, search, currency } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]); 
  const [sortType, setSortType] = useState('relevant');
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (e, productId) => {
    e.preventDefault();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.info("Removed from Wishlist");
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to Wishlist!");
    }
  };

  const handleShare = (e, item) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: item.name,
        url: `${window.location.origin}/product/${item._id}`,
      }).catch(console.error);
    }
  };

  const applyFilterAndSearch = () => {
    let temp = products.slice();
    if (search) {
      temp = temp.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryId) {
      temp = temp.filter(item => item.category.toLowerCase() === categoryId.toLowerCase() || item.subCategory.toLowerCase() === categoryId.toLowerCase());
    }
    setFilterProducts(temp);
  }

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    if (sortType === 'low-high') { setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price))); }
    else if (sortType === 'high-low') { setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price))); }
  }

  useEffect(() => { applyFilterAndSearch(); }, [products, categoryId, search]);
  useEffect(() => { sortProducts(); }, [sortType]);

  return (
    <div className='pt-8 px-4 md:px-10 border-t min-h-screen bg-white pb-24'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4'>
        <div>
           <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter italic'>
              {search ? `Search: "${search}"` : categoryId ? `${categoryId}` : "Collections"}
           </h2>
           <p className='text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-[0.2em]'>{filterProducts.length} Items Found</p>
        </div>
        <select onChange={(e) => setSortType(e.target.value)} className='bg-gray-50 border-2 border-gray-100 text-[10px] px-4 py-2 rounded-xl outline-none font-black uppercase tracking-widest'>
          <option value="relevant">Relevant</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8'>
        {filterProducts.map((item, index) => (
          <Link to={`/product/${item._id}`} key={index} className='group cursor-pointer block'>
            <div className='overflow-hidden rounded-3xl bg-gray-50 relative border border-gray-100 shadow-sm'>
              
              {/* Product Image - Out of Stock అయితే మాత్రమే మార్పు కనిపిస్తుంది */}
              <img 
                className={`group-hover:scale-110 transition-all duration-500 aspect-[3/4] object-cover w-full ${item.inStock === false ? 'opacity-40 grayscale blur-[1px]' : ''}`} 
                src={item.image[0]} 
                alt={item.name} 
              />

              {/* 👇 అడ్మిన్ 'false' అని సెట్ చేసిన వాటికి మాత్రమే బ్యాడ్జ్ వస్తుంది */}
              {item.inStock === false && (
                <div className='absolute inset-0 flex items-center justify-center z-10 pointer-events-none'>
                  <p className='bg-white/90 backdrop-blur-md text-red-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl border border-red-100'>
                    Sold Out
                  </p>
                </div>
              )}

              {/* Heart Icon */}
              <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 z-20 ${item.inStock === false ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button onClick={(e) => toggleWishlist(e, item._id)} className='p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg'>
                  {wishlist.includes(item._id) ? <HiHeart className='text-xl text-red-500' /> : <HiOutlineHeart className='text-xl' />}
                </button>
              </div>
            </div>

            <div className='mt-4 px-1'>
              <p className='text-[9px] text-blue-600 font-black uppercase tracking-[0.2em]'>{item.subCategory}</p>
              <p className={`text-sm font-bold truncate mt-1 ${item.inStock === false ? 'text-gray-400' : 'text-gray-800'}`}>{item.name}</p>
              <p className={`text-base font-black mt-2 ${item.inStock === false ? 'text-gray-300 line-through' : 'text-black'}`}>
                {currency}{Number(item.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Shop;