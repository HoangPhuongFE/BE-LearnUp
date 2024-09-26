import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name?: string;
  code?: string;
  semesters: mongoose.Types.ObjectId[];
}

const departmentSchema: Schema<IDepartment> = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
    unique: true,
  },
  semesters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
  }],
});

const Department = mongoose.model<IDepartment>('Department', departmentSchema);
export default Department;
