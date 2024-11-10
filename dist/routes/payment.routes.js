"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/payment.routes.ts
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/upgrade", authMiddleware_1.protect, payment_controller_1.PaymentController.createUpgradePayment);
router.post("/webhook", payment_controller_1.PaymentController.handleWebhook);
router.get('/status/:orderCode', authMiddleware_1.protect, payment_controller_1.PaymentController.getPaymentStatus);
exports.default = router;
