import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description?: string;
  fileUrls: string[];
  type: 'pdf' | 'video' | 'document';
  allowedRoles?: ('member_free' | 'member_premium')[]; // Không bắt buộc
}

const resourceSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // Tiêu đề bắt buộc
  description: { type: String, trim: true }, // Mô tả không bắt buộc
  fileUrls: [{ type: String, required: true, trim: true }], // Danh sách file URL là bắt buộc
  type: { type: String, enum: ['pdf', 'video', 'document'], default: 'document' }, // Mặc định là 'document'
  allowedRoles: {
    type: [String],
    enum: ['member_free', 'member_premium'],
    default: ['member_premium'], // Mặc định là 'member_premium'
  },
});

const Resource = mongoose.model<IResource>('Resource', resourceSchema);
export default Resource;
