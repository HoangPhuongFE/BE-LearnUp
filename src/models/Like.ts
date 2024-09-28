import { Schema, Document, model } from 'mongoose';

interface ILike extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: 'like' | 'dislike';
}

const likeSchema = new Schema<ILike>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'dislike'], default: 'like' }
});

const Like = model<ILike>('Like', likeSchema);
export default Like;
