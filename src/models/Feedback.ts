import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IMedia } from './Media';

export interface IFeedback extends Document {
  content: string;
  user: mongoose.Types.ObjectId | IUser;
  media: mongoose.Types.ObjectId | IMedia;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema: Schema<IFeedback> = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
  },
  { timestamps: true }
);

const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
export default Feedback;
