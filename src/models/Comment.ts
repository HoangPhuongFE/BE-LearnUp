import { Schema, Document, model } from 'mongoose';

interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  authorId: Schema.Types.ObjectId;
  content?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false },
  images: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Comment = model<IComment>('Comment', commentSchema);
export default Comment;
