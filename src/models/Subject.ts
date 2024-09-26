import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  resources: mongoose.Types.ObjectId[];
}

const subjectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});

const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
export default Subject;
