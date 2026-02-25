import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import bannerModel from "../models/bannerModel.js"; // 👈 దీనిని ఇంపోర్ట్ చేయండి

// 1. కొత్త ప్రొడక్ట్ యాడ్ చేయడం
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];

        let result = await cloudinary.uploader.upload(image1.path, { 
            resource_type: 'image', 
            timeout: 120000 
        });

        const productData = {
            name, description, category,
            price: Number(price), subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: [result.secure_url],
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added Successfully! 👕" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. అన్ని ప్రొడక్ట్స్ ని లిస్ట్ చేయడం
export const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. ప్రొడక్ట్ ని తొలగించడం
export const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 4. సింగిల్ ప్రొడక్ట్ వివరాలు
export const singleProduct = async (req, res) => {
    try {
        const { productId } = req.query; 
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 5. ప్రొడక్ట్ అప్‌డేట్ (Updated with inStock)
export const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, bestseller, sizes, inStock } = req.body;

        const updateData = {
            name, 
            description, 
            category,
            price: Number(price), 
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            inStock: inStock === "true" || inStock === true ? true : false, // 👈 ఈ లాజిక్ యాడ్ చేయండి
            sizes: JSON.parse(sizes),
            date: Date.now()
        };

        const response = await productModel.findByIdAndUpdate(productId, updateData);
        
        if (response) {
            res.json({ success: true, message: "Product Updated Successfully! ✅" });
        } else {
            res.json({ success: false, message: "Product not found!" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- 🆕 హీరో బ్యానర్ అప్‌డేట్ లాజిక్ ---

// 6. హీరో బ్యానర్‌ని అప్‌డేట్ చేయడం (Image with Model)
export const updateHeroBanner = async (req, res) => {
    try {
        const imageFile = req.file; // అడ్మిన్ ప్యానెల్ నుండి వచ్చే ఫైల్
        if (!imageFile) return res.json({ success: false, message: "No image provided" });

        // క్లౌడినరీకి అప్‌లోడ్ చేయడం
        const result = await cloudinary.uploader.upload(imageFile.path, { 
            resource_type: 'image' 
        });

        // డేటాబేస్‌లో అప్‌డేట్ చేయడం (లేకపోతే కొత్తది క్రియేట్ అవుతుంది)
        const banner = await bannerModel.findOneAndUpdate(
            {}, 
            { image: result.secure_url }, 
            { upsert: true, new: true }
        );

        res.json({ success: true, message: "Hero Banner Updated Successfully! 📸", banner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 7. హోమ్ పేజీ కోసం బ్యానర్ వివరాలను పొందడం
export const getHeroBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findOne({});
        res.json({ success: true, banner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}