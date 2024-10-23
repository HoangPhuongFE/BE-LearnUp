import express from 'express';
import { createPayment } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', protect, createPayment);

export default router;
