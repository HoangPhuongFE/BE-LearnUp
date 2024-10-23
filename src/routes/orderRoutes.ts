import express from 'express';
import { createOrder, updateOrderStatus } from '../controllers/orderController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', protect, createOrder);
router.put('/update-status', protect, updateOrderStatus);

export default router;
