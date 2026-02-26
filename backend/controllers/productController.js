import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import bannerModel from "../models/bannerModel.js";

/**
 * 1. Add new product (Admin)
 */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller
    } = req.body;

    const image1 = req.files?.image1?.[0];
    if (!image1) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image1.path, {
      resource_type: "image",
      timeout: 120000
    });

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: [result.secure_url],

      // 🔑 IMPORTANT: default visibility for user side
      inStock: true,

      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 2. List products (USER SIDE)
 * Only show products that are in stock
 */
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({ inStock: true });
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 3. Remove product (Admin)
 */
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 4. Get single product details
 */
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 5. Update product (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      inStock
    } = req.body;

    const updateData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true" || bestseller === true,
      inStock: inStock === "true" || inStock === true,
      sizes: JSON.parse(sizes),
      date: Date.now()
    };

    const response = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!response) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 6. Update Hero Banner (Admin)
 */
export const updateHeroBanner = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res.json({ success: false, message: "No image provided" });
    }

    const result = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image"
    });

    const banner = await bannerModel.findOneAndUpdate(
      {},
      { image: result.secure_url },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Hero banner updated successfully",
      banner
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 7. Get Hero Banner (User side)
 */
export const getHeroBanner = async (req, res) => {
  try {
    const banner = await bannerModel.findOne({});
    res.json({ success: true, banner });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};