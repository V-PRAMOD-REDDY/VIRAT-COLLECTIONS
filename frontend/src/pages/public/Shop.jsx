import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { HiOutlineHeart, HiHeart, HiChevronDown } from "react-icons/hi";
import { toast } from "react-toastify";

const Shop = () => {
  const { categoryId } = useParams();
  const { products, search, currency } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    setWishlist(prev =>
      prev.includes(id)
        ? (toast.info("Removed from Wishlist"), prev.filter(i => i !== id))
        : (toast.success("Added to Wishlist"), [...prev, id])
    );
  };

  // 1. ఫిల్టరింగ్ లాజిక్ - ఇది products మారినప్పుడల్లా రన్ అవుతుంది
  const applyFilter = () => {
    let temp = [...products];

    if (search) {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      temp = temp.filter(
        p =>
          p.category?.toLowerCase() === categoryId.toLowerCase() ||
          p.subCategory?.toLowerCase() === categoryId.toLowerCase()
      );
    }

    // సార్టింగ్ అప్లై చేయడం
    switch (sortType) {
      case 'low-high':
        setFilterProducts(temp.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(temp.sort((a, b) => b.price - a.price));
        break;
      default:
        setFilterProducts(temp);
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [products, search, categoryId, sortType]); // products లోడ్ అవ్వగానే ఇది రన్ అవుతుంది

  return (
    <div className="pt-8 px-4 md:px-10 pb-24 min-h-screen bg-white">
      
      {/* Header & Sort Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block">
            {search ? `Search: ${search}` : "Collections"}
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
            {filterProducts.length} Items Found
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative group">
          <select 
            onChange={(e) => setSortType(e.target.value)} 
            className="appearance-none bg-gray-50 border-2 border-gray-100 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest outline-none focus:border-black transition-all cursor-pointer pr-10"
          >
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {filterProducts.map(item => {
          const image = Array.isArray(item.image) ? item.image[0] : item.image;

          return (
            <Link to={`/product/${item._id}`} key={item._id} className="group">
              <div className="relative bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-all duration-700"
                />

                {/* Quick View Overlay - Hover చేసినప్పుడు వస్తుంది */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button className="bg-white text-black font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-full shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                        Quick View
                    </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={e => toggleWishlist(e, item._id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-all"
                >
                  {wishlist.includes(item._id) ? (
                    <HiHeart className="text-red-500 text-xl" />
                  ) : (
                    <HiOutlineHeart className="text-xl" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-4 px-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                <p className="font-bold text-gray-900 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</p>
                <p className="font-black text-lg mt-1">
                  {currency}{Number(item.price).toLocaleString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filterProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <h3 className="font-black text-4xl uppercase italic">No Items Found</h3>
        </div>
      )}
    </div>
  );
};

export default Shop;