"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
// src/models/payment.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['UPGRADE_PREMIUM'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentMethod: String,
    bankCode: String,
    bankName: String,
    paymentTime: Date,
    cancelTime: Date,
    transactionId: String,
    paymentLinkId: String,
    paymentData: String
}, {
    timestamps: true
});
exports.Payment = mongoose_1.default.model('Payment', paymentSchema);
