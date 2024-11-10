"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
class PaymentController {
    static createUpgradePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || !req.user.id) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized'
                    });
                }
                // Kiểm tra xem user đã là premium chưa
                if (req.user.role === 'member_premium') {
                    return res.status(400).json({
                        success: false,
                        message: 'You are already a premium member'
                    });
                }
                const result = yield payment_service_1.PaymentService.createUpgradePayment(req.user.id);
                if (!result.success) {
                    return res.status(400).json(result);
                }
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Payment creation error:', error);
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Payment creation failed'
                });
            }
        });
    }
    static handleWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signature = req.headers['x-payos-signature'];
                if (!signature) {
                    return res.status(400).json({
                        success: false,
                        message: 'Missing PayOS signature'
                    });
                }
                // Log webhook data for debugging
                console.log('Received webhook:', {
                    headers: req.headers,
                    body: req.body
                });
                const result = yield payment_service_1.PaymentService.handleWebhook(req.body);
                // Always return 200 for webhooks
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Webhook processing error:', error);
                // Always return 200 for webhooks to prevent retries
                return res.status(200).json({
                    success: false,
                    message: error.message || 'Webhook processing failed'
                });
            }
        });
    }
    static getPaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || !req.user.id) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized'
                    });
                }
                const { orderCode } = req.params;
                if (!orderCode) {
                    return res.status(400).json({
                        success: false,
                        message: 'Order code is required'
                    });
                }
                const result = yield payment_service_1.PaymentService.getPaymentStatus(orderCode, req.user.id);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Get payment status error:', error);
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Get payment status failed'
                });
            }
        });
    }
}
exports.PaymentController = PaymentController;
