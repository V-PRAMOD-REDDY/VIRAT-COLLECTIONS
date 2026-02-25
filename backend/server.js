import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoutes.js';
import userRouter from "./routes/userRoute.js";
import orderRouter from './routes/orderRoutes.js';
import cartRouter from './routes/cartRoutes.js';


// 1. ముందుగా app ని క్రియేట్ చేయాలి
const app = express(); 
const port = process.env.PORT || 4000;

// 2. డేటాబేస్ & క్లౌడ్ కనెక్షన్స్
connectDB();
connectCloudinary();

// 3. మిడిల్‌వేర్స్
app.use(express.json());
app.use(cors());

// 4. API ఎండ్‌పాయింట్స్
app.use('/api/product', productRouter);
app.use('/api/user', userRouter); 
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter); 

app.get('/', (req, res) => {
    res.send("API Working! 🚀 Virat-DB is Live.");
});

// 5. సర్వర్ స్టార్ట్ చేయడం
app.listen(port, () => {
    console.log(`Server started on PORT: ${port}`);
});