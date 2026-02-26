import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
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
        ? (toast.info("Removed"), prev.filter(i => i !== id))
        : (toast.success("Added"), [...prev, id])
    );
  };

  useEffect(() => {
    let temp = [...products];

    if (search)
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );

    if (categoryId)
      temp = temp.filter(
        p =>
          p.category?.toLowerCase() === categoryId.toLowerCase() ||
          p.subCategory?.toLowerCase() === categoryId.toLowerCase()
      );

    setFilterProducts(temp);
  }, [products, search, categoryId]);

  useEffect(() => {
    let arr = [...filterProducts];
    if (sortType === "low-high") arr.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") arr.sort((a, b) => b.price - a.price);
    setFilterProducts(arr);
  }, [sortType]);

  return (
    <div className="pt-8 px-4 md:px-10 pb-24 min-h-screen">
      <h2 className="text-3xl font-black uppercase mb-1">
        {search ? `Search: ${search}` : "Collections"}
      </h2>
      <p className="text-gray-400 text-xs font-bold">
        {filterProducts.length} Items Found
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {filterProducts.map(item => {
          const image =
            Array.isArray(item.image) ? item.image[0] : item.image;

          return (
            <Link to={`/product/${item._id}`} key={item._id}>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full aspect-[3/4] object-cover hover:scale-110 transition"
                />

                <button
                  onClick={e => toggleWishlist(e, item._id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full"
                >
                  {wishlist.includes(item._id) ? (
                    <HiHeart className="text-red-500 text-xl" />
                  ) : (
                    <HiOutlineHeart className="text-xl" />
                  )}
                </button>
              </div>

              <p className="mt-2 font-bold truncate">{item.name}</p>
              <p className="font-black">
                {currency}
                {item.price}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;