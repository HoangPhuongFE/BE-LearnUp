import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IMedia } from './Media';

export interface IEvaluation extends Document {
  user: mongoose.Types.ObjectId | IUser;
  media: mongoose.Types.ObjectId | IMedia;
  rating: number;
  createdAt: Date;
}

const evaluationSchema: Schema<IEvaluation> = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Evaluation = mongoose.model<IEvaluation>('Evaluation', evaluationSchema);
export default Evaluation;
