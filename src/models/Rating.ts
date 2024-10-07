import { Schema, Document, model } from 'mongoose';

// Định nghĩa interface cho Rating
interface IRating extends Document {
  user: Schema.Types.ObjectId;
  video: Schema.Types.ObjectId;
  rating: number;
  createdAt: Date;
}

// Định nghĩa Schema cho Rating
const ratingSchema = new Schema<IRating>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },  // Liên kết với video
  rating: { type: Number, required: true, min: 1, max: 5 },  // Đánh giá từ 1 đến 5 sao
  createdAt: { type: Date, default: Date.now },
});

// Tạo Model Rating dựa trên Schema
const Rating = model<IRating>('Rating', ratingSchema);
export default Rating;
