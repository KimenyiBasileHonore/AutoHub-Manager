import express from 'express';
const router = express.Router();
import { acceptPayment,  processSuccessInfo } from '../controllers/paymentController.js';

router.post('/accept-payment', acceptPayment);
router.get('/payment-success', processSuccessInfo);

export default router;
