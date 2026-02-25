import express from 'express'
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js'
import authUser from '../middleware/authMiddleware.js' // 👈 యూజర్ లాగిన్ అయి ఉండాలి

const cartRouter = express.Router()

// కార్ట్ రిక్వెస్ట్‌లను హ్యాండిల్ చేయడం
cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)

export default cartRouter