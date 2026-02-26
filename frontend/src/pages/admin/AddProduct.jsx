import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddProduct = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

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

    if (!backendUrl) {
      toast.error("Backend URL missing in .env")
      return
    }

    const loadToast = toast.loading("Adding Product...")

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

      // ✅ FIXED: ENV BASED BACKEND
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
        setPrice("")
        setImage1(false)
        setSizes([])
        setBestseller(false)
        setOffer(false)
      } else {
        throw new Error(response.data.message)
      }

    } catch (error) {
      toast.update(loadToast, {
        render: error.message || "Server Error",
        type: "error",
        isLoading: false,
        autoClose: 3000
      })
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
      <h2>Add New Product</h2>

      <label>
        <img
          src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
          className="w-32 cursor-pointer"
        />
        <input type="file" hidden onChange={(e) => setImage1(e.target.files[0])} />
      </label>

      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      <input value={price} onChange={e => setPrice(e.target.value)} type="number" required />

      <button type="submit">ADD PRODUCT</button>
    </form>
  )
}

export default AddProduct