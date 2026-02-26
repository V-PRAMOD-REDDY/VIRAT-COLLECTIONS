import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../context/ShopContext';
// చిన్న ఐకాన్ కోసం ఒకవేళ మీరు lucide-react వాడుతుంటే
import { ImagePlus } from 'lucide-react';

const AddProduct = () => {
  const [image1, setImage1] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("New Arrivals");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [offer, setOffer] = useState(false); 
  const [sizes, setSizes] = useState([]);

  const { token, backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Admin not authenticated! Please login.");
      return;
    }

    const loadToast = toast.loading("Adding Product... Please wait.");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("offer", offer); 
      formData.append("sizes", JSON.stringify(sizes));
      
      if (image1) {
        formData.append("image1", image1);
      } else {
        toast.update(loadToast, { render: "Please upload a product image!", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.update(loadToast, { render: "Product Added Successfully! 🎉", type: "success", isLoading: false, autoClose: 3000 });
        setName(''); 
        setDescription(''); 
        setImage1(false); 
        setPrice(''); 
        setSizes([]); 
        setBestseller(false); 
        setOffer(false);
      } else {
        toast.update(loadToast, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error) {
      toast.update(loadToast, { render: "Server Error! Check backend connection.", type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100'>
      <h2 className='text-3xl font-black uppercase mb-4 text-gray-900 tracking-tighter italic'>Add New Product</h2>
      
      {/* --- క్రియేటివ్ ఇమేజ్ అప్‌లోడ్ సెక్షన్ --- */}
      <div className='flex flex-col gap-3 w-full'>
        <p className='font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]'>Visual Presentation</p>
        
        <label htmlFor="image1" className='group relative cursor-pointer w-40 h-40'>
            <div className={`w-full h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden
                ${!image1 ? 'border-gray-200 bg-gray-50 hover:border-black hover:bg-white' : 'border-black bg-white'}`}>
                
                {!image1 ? (
                    <div className='flex flex-col items-center gap-2 p-4 text-center'>
                        <div className='bg-white p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform'>
                             <img className='w-8' src={assets.upload_area} alt="" />
                        </div>
                        <p className='text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black'>Click to Upload Image</p>
                    </div>
                ) : (
                    <img className='w-full h-full object-cover transition-transform group-hover:scale-110' 
                         src={URL.createObjectURL(image1)} alt="Preview" />
                )}
                
                {/* ఇమేజ్ సెలెక్ట్ అయ్యాక వచ్చే ఓవర్లే */}
                {image1 && (
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2rem]'>
                        <p className='text-white text-[9px] font-black uppercase tracking-widest'>Change Image</p>
                    </div>
                )}
            </div>
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" accept="image/*" hidden />
        </label>
      </div>

      {/* --- మిగిలిన ఫామ్ ఫీల్డ్స్ --- */}
      <div className='w-full max-w-[500px] mt-4'>
        <p className='mb-2 font-black text-[10px] uppercase tracking-widest text-gray-400'>Identity</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-bold placeholder:text-gray-300' type="text" placeholder='Product Name' required />
      </div>

      <div className='w-full max-w-[500px]'>
        <p className='mb-2 font-black text-[10px] uppercase tracking-widest text-gray-400'>Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-medium placeholder:text-gray-300' placeholder='Fabric details, fitting and style...' rows={3} required />
      </div>

      <div className='flex flex-wrap gap-5 w-full max-w-[500px]'>
        <div className='flex-1 min-w-[150px]'>
          <p className='mb-2 font-black text-[10px] uppercase tracking-widest text-gray-400'>Classification</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-4 py-4 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase outline-none focus:border-black transition-all cursor-pointer'>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Shirts">Shirts</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jeans">Jeans & Trousers</option>
            <option value="Ethnic Wear">Ethnic Wear</option>
            <option value="Party Wear">Party Wear</option>
            <option value="Combos">Combos</option>
            <option value="Sale">Sale 🔥</option>
          </select>
        </div>

        <div className='flex-1 min-w-[150px]'>
          <p className='mb-2 font-black text-[10px] uppercase tracking-widest text-gray-400'>Price (INR)</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-black text-lg' type="Number" placeholder='₹ 999' required />
        </div>
      </div>

      <div>
        <p className='mb-3 font-black text-[10px] uppercase tracking-widest text-gray-400'>Available Sizes</p>
        <div className='flex gap-3 flex-wrap'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-black text-white border-black scale-110 shadow-md" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"} w-14 h-14 flex items-center justify-center cursor-pointer border-2 rounded-2xl font-black transition-all text-xs`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-4 mt-6 bg-gray-50 p-6 rounded-3xl w-full max-w-[500px] border border-gray-100'>
        <div className='flex gap-4 items-center cursor-pointer group'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-5 h-5 accent-black cursor-pointer' />
          <label className='font-black text-[10px] uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors' htmlFor="bestseller">Mark as Bestseller</label>
        </div>

        <div className='flex gap-4 items-center cursor-pointer group'>
          <input onChange={() => setOffer(prev => !prev)} checked={offer} type="checkbox" id='offer' className='w-5 h-5 accent-red-600 cursor-pointer' />
          <label className='font-black text-[10px] uppercase tracking-widest text-red-500 cursor-pointer' htmlFor="offer">🔥 Add to Special Sale</label>
        </div>
      </div>

      <button type="submit" className='w-full max-w-[250px] py-5 mt-6 bg-black text-white rounded-[2rem] hover:bg-gray-800 transition-all uppercase font-black text-xs tracking-[0.3em] shadow-2xl active:scale-95'>
        Confirm & Add Product
      </button>
    </form>
  )
}

export default AddProduct;