import express from 'express';
const router = express.Router();
import {addToCart, getCartForUser,updateProductStock, getAllCartItems, deleteProductItemById, clearCartForUser, updateOrderStatus,  getOrderStatus, bookAppointment, getAllAppointmentsForUser, countAllCartProducts, getTopSellingProduct } from '../controllers/cartController.js';
import checkAuth from '../middleware/checkAuthentication.js';

router.post('/add-to-cart', checkAuth, addToCart);
router.get('/user', checkAuth, getCartForUser);
router.get('/all', getAllCartItems);
router.delete('/productcart/:id', deleteProductItemById); 
router.delete('/clear-cart', checkAuth, clearCartForUser);
router.put('/update-order-status',  updateOrderStatus);
router.get('/order-status/:cartItemId', checkAuth, getOrderStatus);
router.post('/book-appointment', checkAuth, bookAppointment);
router.get('/all-appointments', getAllAppointmentsForUser);
router.get('/count-all-cart-products', countAllCartProducts);
router.get('/top-selling-product', getTopSellingProduct);
router.put('/update-product-stock', updateProductStock);




export default router;
