import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IMedia extends Document {
  title: string;
  description: string;
  url: string;
  user: mongoose.Types.ObjectId | IUser;
  comments: mongoose.Types.ObjectId[];
  ratings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema: Schema<IMedia> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }],
  },
  { timestamps: true }
);

const Media = mongoose.model<IMedia>('Media', mediaSchema);
export default Media;
