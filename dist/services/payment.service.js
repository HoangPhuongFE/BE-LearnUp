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
const email_service_1 = require("../services/email.service");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PaymentService {
    static createUpgradePayment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check user exists and not premium
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (user.role === "member_premium") {
                    throw new Error("User already has premium membership");
                }
                const orderCode = Date.now();
                const description = 'Premium';
                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30); // 30 days premium
                const paymentData = {
                    orderCode,
                    amount: this.PREMIUM_PRICE,
                    description,
                    cancelUrl: `${process.env.BE_URL}/payment/cancel`,
                    returnUrl: `${process.env.BE_URL}/payment/success`,
                    webhookUrl: `${process.env.PAYOS_WEBHOOK_URL}/api/payment/webhook`
                };
                // Create payment link via PayOS
                const paymentResponse = yield this.payOS.createPaymentLink(paymentData);
                // Save to database
                yield payment_model_1.Payment.create({
                    orderId: orderCode.toString(),
                    userId,
                    amount: this.PREMIUM_PRICE,
                    type: 'UPGRADE_PREMIUM',
                    status: 'PENDING',
                    startDate,
                    endDate,
                    paymentLinkId: paymentResponse.paymentLinkId,
                    paymentData: JSON.stringify(paymentResponse)
                });
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
                const isValidSignature = this.payOS.verifyPaymentWebhookData(webhookData);
                if (!isValidSignature) {
                    throw new Error("Invalid webhook signature");
                }
                let orderInfo;
                try {
                    orderInfo = JSON.parse(webhookData.data.description || "{}");
                }
                catch (error) {
                    console.error("Error parsing description:", error);
                    throw new Error("Invalid description format");
                }
                // Get user info for email
                const user = yield User_1.default.findById(orderInfo.userId);
                if (!user) {
                    throw new Error("User not found");
                }
                switch (webhookData.code) {
                    case "00": { // Payment success
                        try {
                            // Update payment status
                            const payment = yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                                status: "SUCCESS",
                                paymentMethod: webhookData.data.paymentMethod,
                                bankCode: webhookData.data.bankCode,
                                paymentTime: new Date(),
                                paymentData: JSON.stringify(webhookData.data)
                            }, { session });
                            if (!payment) {
                                throw new Error("Payment not found");
                            }
                            // Update user role
                            yield User_1.default.findByIdAndUpdate(orderInfo.userId, {
                                role: "member_premium",
                                premiumStartDate: orderInfo.startDate,
                                premiumEndDate: orderInfo.endDate
                            }, { session });
                            // Send success email
                            if (user.email) {
                                yield email_service_1.EmailService.sendPaymentSuccessEmail(user.email, {
                                    orderCode: webhookData.data.orderCode.toString(),
                                    amount: payment.amount,
                                    paymentMethod: webhookData.data.paymentMethod,
                                    startDate: orderInfo.startDate,
                                    endDate: orderInfo.endDate,
                                    userName: user.name || 'Học viên'
                                });
                            }
                            yield session.commitTransaction();
                            return { success: true, message: "Payment processed successfully" };
                        }
                        catch (error) {
                            yield session.abortTransaction();
                            throw error;
                        }
                    }
                    case "01": { // Payment cancelled
                        try {
                            yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                                status: "CANCELLED",
                                cancelTime: new Date(),
                                cancelReason: webhookData.data.cancelReason || 'User cancelled',
                                paymentData: JSON.stringify(webhookData.data)
                            }, { session });
                            // Send cancel email
                            if (user.email) {
                                yield email_service_1.EmailService.sendPaymentFailedEmail(user.email, {
                                    orderCode: webhookData.data.orderCode.toString(),
                                    reason: webhookData.data.cancelReason || 'User cancelled',
                                    userName: user.name || 'Học viên',
                                    cancelTime: new Date()
                                });
                            }
                            yield session.commitTransaction();
                            return { success: true, message: "Payment cancelled" };
                        }
                        catch (error) {
                            yield session.abortTransaction();
                            throw error;
                        }
                    }
                    case "02": { // Payment failed
                        try {
                            yield payment_model_1.Payment.findOneAndUpdate({ orderId: webhookData.data.orderCode.toString() }, {
                                status: "FAILED",
                                paymentData: JSON.stringify(webhookData.data)
                            }, { session });
                            // Send failed email
                            if (user.email) {
                                yield email_service_1.EmailService.sendPaymentFailedEmail(user.email, {
                                    orderCode: webhookData.data.orderCode.toString(),
                                    reason: 'Payment failed',
                                    userName: user.name || 'Học viên',
                                    cancelTime: new Date()
                                });
                            }
                            yield session.commitTransaction();
                            return { success: true, message: "Payment failed" };
                        }
                        catch (error) {
                            yield session.abortTransaction();
                            throw error;
                        }
                    }
                    default: {
                        yield session.abortTransaction();
                        return { success: false, message: "Unknown payment status" };
                    }
                }
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
    // Check payment status
    static getPaymentStatus(orderCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_model_1.Payment.findOne({ orderId: orderCode, userId });
                if (!payment) {
                    throw new Error("Payment not found");
                }
                return {
                    success: true,
                    data: {
                        status: payment.status,
                        paymentTime: payment.paymentTime,
                        cancelTime: payment.cancelTime,
                        cancelReason: payment.cancelReason
                    }
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }
        });
    }
}
exports.PaymentService = PaymentService;
PaymentService.payOS = new node_1.default(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);
PaymentService.PREMIUM_PRICE = 10000; // 10,000 VND
