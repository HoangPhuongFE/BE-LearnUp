import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

const messageSchema: Schema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
