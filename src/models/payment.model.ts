// src/models/payment.model.ts
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  startDate: Date,
  endDate: Date,
  cancelTime: Date,
  cancelReason: String,
  transactionId: String,
  paymentLinkId: String,
  paymentData: String
}, {
  timestamps: true
});

export const Payment = mongoose.model('Payment', paymentSchema);