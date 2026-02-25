import React, { useContext } from 'react';
// రెండు ఫోల్డర్లు వెనక్కి వెళ్ళాలి (public -> pages -> src)
import { ShopContext } from '../../context/ShopContext'; 
import ProductCard from '../../components/ProductCard';
import HeroBanner from '../../components/HeroBanner';

const Home = () => {
  const { products } = useContext(ShopContext);

  return (
    <div className="bg-white">
      {/* 1. Hero Banner Section - ఇప్పుడు ఇమేజ్ కనిపిస్తుంది */}
      <HeroBanner /> 

      {/* 2. Latest Collections Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black mb-8 uppercase text-center">Latest Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {products.slice(0, 10).map((item, index) => (
            <ProductCard key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;