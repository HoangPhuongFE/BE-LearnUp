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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
// src/services/payment.service.ts
const node_1 = __importDefault(require("@payos/node"));
const payment_model_1 = require("../models/payment.model");
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentService {
    static createUpgradePayment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (user.role === "member_premium") {
                    throw new Error("User already has premium membership");
                }
                const orderCode = Date.now();
                const paymentData = {
                    orderCode,
                    amount: this.PREMIUM_PRICE,
                    description: 'Premium', // Sử dụng mô tả ngắn gọn
                    cancelUrl: `${process.env.BE_URL}/payment/cancel`,
                    returnUrl: `${process.env.BE_URL}/payment/success`,
                    webhookUrl: process.env.PAYOS_WEBHOOK_URL
                };
                const paymentResponse = yield this.payOS.createPaymentLink(paymentData);
                // Lưu thông tin payment, bao gồm userId
                yield payment_model_1.Payment.create({
                    orderId: orderCode.toString(),
                    userId,
                    amount: this.PREMIUM_PRICE,
                    type: 'UPGRADE_PREMIUM',
                    status: 'PENDING',
                    paymentLinkId: paymentResponse.paymentLinkId,
                    paymentData: JSON.stringify(paymentResponse)
                });
                // Trả về URL thanh toán cho FE
                return {
                    success: true,
                    data: {
                        checkoutUrl: paymentResponse.checkoutUrl,
                        orderCode: orderCode.toString()
                    }
                };
            }
            catch (error) {
                console.error("Create payment error:", error);
                return {
                    success: false,
                    message: error.message
                };
            }
        });
    }
    static handleWebhook(webhookData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                // Verify webhook data
                const isValidSignature = this.payOS.verifyPaymentWebhookData(webhookData);
                if (!isValidSignature) {
                    throw new Error("Invalid webhook signature");
                }
                if (webhookData.code === "00") { // Success
                    try {
                        // Update payment status
                        const payment = yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                            status: "SUCCESS",
                            paymentData: JSON.stringify(webhookData.data)
                        }, { session });
                        if (!payment) {
                            throw new Error("Payment not found");
                        }
                        // Update user role using userId from payment
                        const user = yield User_1.default.findByIdAndUpdate(payment.userId, {
                            role: "member_premium",
                            premiumStartDate: new Date(),
                            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                        }, { session, new: true });
                        if (!user) {
                            throw new Error("User not found");
                        }
                        yield session.commitTransaction();
                        return { success: true, message: "Payment processed successfully" };
                    }
                    catch (error) {
                        yield session.abortTransaction();
                        throw error;
                    }
                }
                else if (webhookData.code === "01") { // Cancel
                    yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                        status: "CANCELLED",
                        paymentData: JSON.stringify(webhookData.data)
                    }, { session });
                    yield session.commitTransaction();
                    return { success: true, message: "Payment cancelled" };
                }
                else { // Error or other cases
                    yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                        status: "FAILED",
                        paymentData: JSON.stringify(webhookData.data)
                    }, { session });
                    yield session.commitTransaction();
                    return { success: true, message: "Payment failed" };
                }
                //
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("Handle webhook error:", error);
                return {
                    success: false,
                    message: error.message
                };
            }
            finally {
                session.endSession();
            }
        });
    }
}
exports.PaymentService = PaymentService;
PaymentService.payOS = new node_1.default(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);
PaymentService.PREMIUM_PRICE = 10000;
