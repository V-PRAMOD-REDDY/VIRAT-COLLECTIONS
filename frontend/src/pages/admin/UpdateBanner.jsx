import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const UpdateBanner = () => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://virat-collections.onrender.com";
  const token = localStorage.getItem("token");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Admin token missing. Please login again.");
    }

    if (!image) {
      return toast.error("Please select an image first!");
    }

    const loadToast = toast.loading("Uploading Hero Banner...");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        `${backendUrl}/api/product/update-banner`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        toast.update(loadToast, {
          render: "Hero Banner Updated Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        setImage(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.update(loadToast, {
          render: response.data.message,
          type: "error",
          isLoading: false
        });
      }
    } catch (err) {
      toast.update(loadToast, {
        render: "Upload failed!",
        type: "error",
        isLoading: false
      });
    }
  };

  return (
    <div className="p-8">
      <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-2xl shadow-xl max-w-xl">
        <h2 className="text-2xl font-black mb-4">Update Hero Banner</h2>

        <label className="cursor-pointer block">
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            className="w-full h-64 object-cover border-2 border-dashed rounded-xl"
          />
          <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
        </label>

        <button
          disabled={loading}
          className="mt-6 w-full py-4 bg-black text-white rounded-xl font-black"
        >
          {loading ? "UPLOADING..." : "UPDATE BANNER"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBanner;