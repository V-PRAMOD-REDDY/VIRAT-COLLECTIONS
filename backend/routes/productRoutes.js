import express from 'express';
import { 
    addProduct, listProducts, removeProduct, singleProduct, updateProduct,
    updateHeroBanner, getHeroBanner // 👈 కొత్త కంట్రోలర్లను ఇంపోర్ట్ చేయండి
} from '../controllers/productController.js';
import multer from 'multer';
import adminAuth from '../middleware/adminAuth.js'; // అడ్మిన్ మాత్రమే మార్చగలిగేలా

const productRouter = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

productRouter.post('/add', upload.fields([{ name: 'image1', maxCount: 1 }]), addProduct);
productRouter.post('/remove', removeProduct);
productRouter.post('/update', updateProduct); 
productRouter.get('/single', singleProduct);
productRouter.get('/list', listProducts);

// --- 🆕 హీరో బ్యానర్ రూట్స్ ---
productRouter.post('/update-banner', adminAuth, upload.single('image'), updateHeroBanner);
productRouter.get('/get-banner', getHeroBanner);

export default productRouter;