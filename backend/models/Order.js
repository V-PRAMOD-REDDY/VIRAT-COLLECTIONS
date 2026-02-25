import mongoose from 'mongoose'

// ఆర్డర్ డేటా స్ట్రక్చర్ (Schema) డిజైన్ చేయడం
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
})

// ఇప్పటికే మోడల్ క్రియేట్ అయి ఉంటే దానిని వాడటం, లేదంటే కొత్తది క్రియేట్ చేయడం
const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel // 👈 ఈ లైన్ ఉండటం వల్ల కంట్రోలర్ లో ఎర్రర్ రాదు