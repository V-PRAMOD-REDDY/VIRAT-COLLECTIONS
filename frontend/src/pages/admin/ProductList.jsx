import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(ShopContext); // Context నుండి తీసుకుంటున్నాం

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error("డేటా లోడ్ చేయడంలో సమస్య!");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if(window.confirm("Are you sure?")) {
      try {
        const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
        if (response.data.success) {
          toast.success("Product Deleted!");
          fetchProducts();
        }
      } catch (error) { toast.error("Error deleting!"); }
    }
  };

  useEffect(() => { fetchProducts(); }, [backendUrl]);

  if (loading) return <div className="text-center py-20 font-bold animate-pulse uppercase tracking-widest">Fetching Products...</div>;

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase">Product Inventory</h2>
        <span className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full italic">Total: {products.length} Items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-[10px] md:text-xs uppercase text-gray-500 font-black tracking-widest">
              <th className="pb-4">Image</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">Price</th>
              <th className="pb-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <img src={item.image[0]} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl shadow-sm" alt="" />
                </td>
                <td className="py-4 font-bold text-sm md:text-base">{item.name}</td>
                <td className="py-4 font-black text-blue-600 italic">₹{item.price}</td>
                <td className="py-4 text-center">
                  <div className='flex gap-2 justify-center'>
                    <button onClick={() => navigate(`/admin/edit-product/${item._id}`)} className="text-[10px] font-black uppercase border-2 border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all active:scale-95">Edit</button>
                    <button onClick={() => removeProduct(item._id)} className="text-[10px] font-black uppercase border-2 border-red-500 text-red-500 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-95">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;