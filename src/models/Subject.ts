import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  semester: mongoose.Types.ObjectId;
  resources: mongoose.Types.ObjectId[];
}

const subjectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});
// Chuyển đổi _id thành id khi trả về JSON
subjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});
const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
export default Subject;
