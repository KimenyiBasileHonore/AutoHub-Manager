import express from 'express';
const router = express.Router();
import { createProduct, getProductById, getAllProducts, deleteProductById,  rateProductById, getProductCount} from "../controllers/productController.js";

router.post("/addproduct", createProduct);
router.get("/product/:id", getProductById);
router.get("/allproduct", getAllProducts); 
router.delete('/product/:id', deleteProductById); 
router.put('/product/:id/rate', rateProductById);
router.get('/product-count', getProductCount);

export default router;







