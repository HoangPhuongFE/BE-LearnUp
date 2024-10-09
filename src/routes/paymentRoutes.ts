import express from 'express';
import { createPaymentLink, handlePaymentWebhook } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-payment-link', protect, createPaymentLink);
router.post('/webhook', handlePaymentWebhook);

export default router;
