import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
