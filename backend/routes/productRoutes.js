import express from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
  updateHeroBanner,
  getHeroBanner
} from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

router.post("/add", adminAuth, upload.fields([{ name: "image1", maxCount: 1 }]), addProduct);
router.post("/remove", adminAuth, removeProduct);
router.post("/update", adminAuth, updateProduct);

router.get("/list", listProducts);
router.get("/single", singleProduct);

router.post("/update-banner", adminAuth, upload.single("image"), updateHeroBanner);
router.get("/get-banner", getHeroBanner);

export default router;