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
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const loadToast = toast.loading("Adding Product... Please wait.")

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL

      if (!backendUrl) {
        toast.update(loadToast, {
          render: "Backend URL not found (.env)",
          type: "error",
          isLoading: false,
          autoClose: 3000
        })
        return
      }

      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("offer", offer)
      formData.append("sizes", JSON.stringify(sizes))
      if (image1) formData.append("image1", image1)

      // ✅ CORRECT URL (NO SPACE)
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData
      )

      if (response.data.success) {
        toast.update(loadToast, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000
        })

        // reset form
        setName("")
        setDescription("")
        setImage1(false)
        setPrice("")
        setSizes([])
        setBestseller(false)
        setOffer(false)
      } else {
        toast.update(loadToast, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000
        })
      }
    } catch (error) {
      toast.update(loadToast, {
        render: "Server Error! Check backend.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      })
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-8 bg-white rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-2xl font-black uppercase mb-4'>Add New Product</h2>

      <p className='font-bold text-gray-400 text-xs uppercase tracking-widest'>Upload Product Image</p>
      <label htmlFor="image1">
        <img
          className='w-32 cursor-pointer border-2 border-dashed border-gray-200 p-3 rounded-2xl hover:border-black transition-all'
          src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
          alt=""
        />
        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
      </label>

      {/* 👇 REST OF UI UNCHANGED */}
      {/* (name, description, category, price, sizes, checkboxes, button) */}
    </form>
  )
}

export default AddProduct