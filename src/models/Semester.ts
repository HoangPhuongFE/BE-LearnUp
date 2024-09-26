import mongoose, { Schema, Document } from 'mongoose';

export interface ISemester extends Document {
  name: string;
  subjects: mongoose.Types.ObjectId[];
}

const semesterSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Kỳ 1', 'Kỳ 2', 'Kỳ 3', 'Kỳ 4', 'Kỳ 5', 'Kỳ 6', 'Kỳ 7', 'Kỳ 8', 'Kỳ 9'],
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
});

const Semester = mongoose.model<ISemester>('Semester', semesterSchema);
export default Semester;
