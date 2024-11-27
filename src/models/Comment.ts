import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  postId?: Schema.Types.ObjectId;
  resourceId?: Schema.Types.ObjectId;
  subjectId?: Schema.Types.ObjectId; // Add this line
  authorId: Schema.Types.ObjectId;
  content?: string;
  images?: string[];
  parentCommentId?: Schema.Types.ObjectId; // Parent comment (if it's a reply)
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: false },
  resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: false },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: false }, // Add this line
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: { type: [String], trim: true, default: [] },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
