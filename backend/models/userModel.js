import mongoose from "mongoose";

// backend/models/userModel.js
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" }, // 👈 ఇది ఖచ్చితంగా ఉండాలి
    cartData: { type: Object, default: {} }, 
    address: { type: Object, default: { street: "", city: "", state: "", zipcode: "", country: "" } } // 👈 ఇక్కడ ఫోన్ తీసేశాను
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;