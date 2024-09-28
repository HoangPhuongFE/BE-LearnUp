import mongoose, { Schema, Document , model } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  authorId: Schema.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post = model<IPost>('Post', postSchema);
export default Post;
