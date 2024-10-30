import mongoose, { Schema, Document } from 'mongoose';

export interface ISemester extends Document {
  name: string;
  department: mongoose.Types.ObjectId;
  subjects: mongoose.Types.ObjectId[];
}

const semesterSchema: Schema<ISemester> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Kỳ 1', 'Kỳ 2', 'Kỳ 3', 'Kỳ 4', 'Kỳ 5', 'Kỳ 6', 'Kỳ 7', 'Kỳ 8', 'Kỳ 9'],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',  // Liên kết với mô hình Department
    required: true,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
});
// Chuyển đổi _id thành id khi trả về JSON
semesterSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});
const Semester = mongoose.model<ISemester>('Semester', semesterSchema);
export default Semester;
