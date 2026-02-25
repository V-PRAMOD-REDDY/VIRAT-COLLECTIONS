import React, { useState } from 'react'
import { assets } from '../../assets/assets' 
import axios from 'axios'
import { toast } from 'react-toastify'

const AddProduct = () => {
  const [image1, setImage1] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Shirts")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [offer, setOffer] = useState(false) 
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Adding Product... Please wait.");
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("offer", offer) 
      formData.append("sizes", JSON.stringify(sizes))
      image1 && formData.append("image1", image1)

      // పోర్ట్ 4000 లో సర్వర్ రన్ అవుతోందని కన్ఫర్మ్ చేసుకోండి
      const response = await axios.post("http://localhost:4000/api/product/add", formData)

      if (response.data.success) {
        toast.update(loadToast, { render: response.data.message, type: "success", isLoading: false, autoClose: 3000 });
        setName(''); setDescription(''); setImage1(false); setPrice(''); setSizes([]); setBestseller(false); setOffer(false);
      } else {
        toast.update(loadToast, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error) {
      toast.update(loadToast, { render: "Server Error! Check if backend is running.", type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-8 bg-white rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-2xl font-black uppercase mb-4'>Add New Product</h2>
      
      <p className='font-bold text-gray-400 text-xs uppercase tracking-widest'>Upload Product Image</p>
      <label htmlFor="image1">
        <img className='w-32 cursor-pointer border-2 border-dashed border-gray-200 p-3 rounded-2xl hover:border-black transition-all' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
      </label>

      <div className='w-full max-w-[500px]'>
        <p className='mb-2 font-bold text-sm'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-medium' type="text" placeholder='Ex: Premium Cotton Shirt' required />
      </div>

      <div className='w-full max-w-[500px]'>
        <p className='mb-2 font-bold text-sm'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-medium' placeholder='Describe the fabric and fit...' rows={3} required />
      </div>

      <div className='flex flex-wrap gap-5 w-full max-w-[500px]'>
        <div className='flex-1 min-w-[150px]'>
          <p className='mb-2 font-bold text-sm'>Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-3 border-2 border-gray-100 rounded-xl font-bold outline-none focus:border-black transition-all'>
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
          <p className='mb-2 font-bold text-sm'>Price (INR)</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-bold' type="Number" placeholder='999' required />
        </div>
      </div>

      <div>
        <p className='mb-3 font-bold text-sm'>Available Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-black text-white border-black" : "bg-gray-50 border-gray-100"} px-4 py-2 cursor-pointer border-2 rounded-xl font-bold transition-all text-sm`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-3 mt-4'>
        <div className='flex gap-3 items-center cursor-pointer'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-5 h-5 accent-black' />
          <label className='font-bold text-sm cursor-pointer' htmlFor="bestseller">Mark as Bestseller</label>
        </div>

        <div className='flex gap-3 items-center cursor-pointer'>
          <input onChange={() => setOffer(prev => !prev)} checked={offer} type="checkbox" id='offer' className='w-5 h-5 accent-red-600' />
          <label className='font-bold text-sm text-red-600 cursor-pointer' htmlFor="offer">🔥 Add to Special Sale</label>
        </div>
      </div>

      <button type="submit" className='w-full max-w-[200px] py-4 mt-6 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all uppercase font-black tracking-widest shadow-lg active:scale-95'>
        Add Product
      </button>
    </form>
  )
}

export default AddProduct; // 👈 మునుపటి 'ReferenceError' రాకుండా ఇది తప్పనిసరి!