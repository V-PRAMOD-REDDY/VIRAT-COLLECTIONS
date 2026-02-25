import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error("కనెక్షన్ సమస్య!");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if(window.confirm("Are you sure?")) {
      try {
        const response = await axios.post('http://localhost:4000/api/product/remove', { id });
        if (response.data.success) {
          toast.success("Product Deleted!");
          fetchProducts();
        }
      } catch (error) { toast.error("Error deleting!"); }
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  if (loading) return <div className="text-center py-20 font-bold">Loading...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">All Products List</h2>
        <span className="bg-gray-100 text-gray-800 text-sm font-bold px-4 py-2 rounded-lg">Total: {products.length} Items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-sm uppercase text-gray-500">
              <th className="pb-4 font-bold">Image</th>
              <th className="pb-4 font-bold">Name</th>
              <th className="pb-4 font-bold">Price</th>
              <th className="pb-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4"><img src={item.image[0]} className="w-16 h-16 object-cover rounded-md" alt="" /></td>
                <td className="py-4 font-bold">{item.name}</td>
                <td className="py-4 font-bold">₹{item.price}</td>
                <td className="py-4 text-center">
                  <div className='flex gap-2 justify-center'>
                    {/* ఇక్కడ మీ App.jsx లోని పాత్ కి మ్యాచ్ అవుతుంది */}
                    <button onClick={() => navigate(`/admin/edit-product/${item._id}`)} className="text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-all">Edit</button>
                    <button onClick={() => removeProduct(item._id)} className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-all">Delete</button>
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