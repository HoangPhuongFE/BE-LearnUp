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
exports.createPayment = void 0;
const paymentService_1 = require("../services/paymentService");
const pricing_1 = require("../config/pricing");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product } = req.body;
    const user = req.user;
    const amount = pricing_1.pricing[product];
    try {
        // Tạo mã orderCode ngẫu nhiên có độ dài dưới 6 chữ số
        const orderCode = Math.floor(Math.random() * 899999) + 1;
        const paymentLink = yield (0, paymentService_1.createPaymentLink)({
            orderCode: orderCode, // Sử dụng orderCode dưới dạng số
            amount,
            description: `Thanh toán ${product}`,
            returnUrl: 'http://localhost:3030/payment/success',
            cancelUrl: 'http://localhost:3030/payment/cancel'
        });
        res.json({
            success: true,
            checkoutUrl: paymentLink.checkoutUrl,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Không thể tạo link thanh toán', error: errorMessage });
    }
});
exports.createPayment = createPayment;
