import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard'; // పాత్ సరిచూసుకోండి

const Offers = () => {
    const { products } = useContext(ShopContext);
    const [offerProducts, setOfferProducts] = useState([]);

    useEffect(() => {
        // ఆఫర్ ఉన్న ప్రొడక్ట్స్ ని ఫిల్టర్ చేయడం
        if (products && products.length > 0) {
            const filtered = products.filter(item => item.offer === true);
            setOfferProducts(filtered);
        }
    }, [products]);

    return (
        <div className='my-10 px-4 md:px-10 min-h-[60vh]'>
            <div className='text-center py-8'>
                <h2 className='text-3xl font-black text-red-600 uppercase tracking-tighter'>
                    🔥 Exclusive Special Offers
                </h2>
            </div>

            {offerProducts.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                    {offerProducts.map((item, index) => (
                        <ProductCard key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-20 text-gray-400'>
                    <p className='text-xl font-bold'>No special offers right now 🥲</p>
                </div>
            )}
        </div>
    );
};

export default Offers;