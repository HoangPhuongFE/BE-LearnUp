// src/routes/payment.routes.ts
import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/upgrade", protect, PaymentController.createUpgradePayment);
router.post("/webhook", PaymentController.handleWebhook);
router.get('/status/:orderCode', protect, PaymentController.getPaymentStatus);

// Thay vì chuyển hướng, gửi phản hồi trực tiếp
router.get('/success', (req, res) => {
    res.send('<h1>Thanh toán thành công!</h1><p>Cảm ơn bạn đã mua hàng.</p>');
  });
  
  router.get('/cancel', (req, res) => {
    res.send('<h1>Thanh toán bị hủy</h1><p>Giao dịch của bạn đã bị hủy.</p>');
  });

export default router;