import mongoose, { Schema, Document } from 'mongoose';

interface IMeeting extends Document {
  title: string;           // Tiêu đề của buổi học
  description?: string;    
  meetLink: string;        
  startTime: Date;          
  endTime: Date;           
}

const meetingSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },                 // Tiêu đề bắt buộc
  description: { type: String },                           // Mô tả không bắt buộc
  meetLink: { type: String, required: true },              // Link Google Meet bắt buộc
  startTime: { type: Date, required: true },               // Thời gian bắt đầu
  endTime: { type: Date, required: true },                 // Thời gian kết thúc
});

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
export default Meeting;
