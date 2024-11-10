// src/routes/payment.routes.ts
import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/upgrade", protect, PaymentController.createUpgradePayment);
router.post("/webhook", PaymentController.handleWebhook);

export default router;