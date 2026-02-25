import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [sizes, setSizes] = useState([]);
    const [inStock, setInStock] = useState(true); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/product/single?productId=${id}`);
                if (response.data.success) {
                    const data = response.data.product;
                    setName(data.name);
                    setDescription(data.description);
                    setPrice(data.price);
                    setCategory(data.category);
                    setSubCategory(data.subCategory);
                    setSizes(data.sizes);
                    setInStock(data.inStock !== undefined ? data.inStock : true);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product data!");
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                productId: id,
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                sizes: JSON.stringify(sizes),
                inStock: String(inStock), // 👈 String గా మార్చి పంపడం సురక్షితం
                bestseller: "false" 
            };

            const response = await axios.post("http://localhost:4000/api/product/update", updateData);

            if (response.data.success) {
                toast.success("Product Updated Successfully! ✅");
                navigate('/admin/products'); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed!");
        }
    };

    if (loading) return <div className='p-8 font-black animate-pulse'>Loading Product Data...</div>;

    return (
        <form onSubmit={onSubmitHandler} className='p-8 flex flex-col items-start gap-4 bg-white rounded-[2rem] shadow-xl w-full max-w-[600px] border border-gray-100'>
            <h2 className='text-2xl font-black mb-4 uppercase tracking-tighter italic'>Edit Product</h2>
            
            <div className='w-full'>
                <p className='mb-2 font-bold text-xs uppercase tracking-widest text-gray-400'>Product Name</p>
                <input value={name} onChange={(e)=>setName(e.target.value)} className='w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-black font-bold' type="text" required />
            </div>

            <div className='w-full'>
                <p className='mb-2 font-bold text-xs uppercase tracking-widest text-gray-400'>Description</p>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-black font-medium' rows={3} required />
            </div>

            <div className='flex gap-4 w-full'>
                <div className='flex-1'>
                    <p className='mb-2 font-bold text-xs uppercase tracking-widest text-gray-400'>Price (₹)</p>
                    <input value={price} onChange={(e)=>setPrice(e.target.value)} className='w-full border-2 border-gray-100 p-3 rounded-xl font-black' type="number" required />
                </div>
                <div className='flex-1'>
                    <p className='mb-2 font-bold text-xs uppercase tracking-widest text-gray-400'>Availability</p>
                    <div 
                        onClick={() => setInStock(prev => !prev)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${inStock ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                    >
                        <span className='font-black text-[10px] uppercase'>{inStock ? 'Available' : 'Out of Stock'}</span>
                        <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2 font-bold text-xs uppercase tracking-widest text-gray-400'>Sizes</p>
                <div className='flex gap-3'>
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
                            <p className={`w-12 h-12 flex items-center justify-center cursor-pointer border-2 rounded-xl transition-all font-black ${sizes.includes(size) ? "bg-black text-white border-black" : "bg-gray-50 border-gray-100"}`}>{size}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className='w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all mt-4 uppercase tracking-widest'>
                UPDATE PRODUCT
            </button>
        </form>
    );
};

export default EditProduct;