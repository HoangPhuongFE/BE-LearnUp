import Meeting from '../models/Meeting';

// Tạo buổi học mới
export const createMeeting = async (data: {
  title: string;
  description?: string;
  meetLink: string;
  startTime: Date;
  endTime: Date;
}) => {
  const meeting = new Meeting(data);
  return await meeting.save(); // Lưu buổi học vào cơ sở dữ liệu
};

// Lấy tất cả buổi học
export const getAllMeetings = async () => {
  return await Meeting.find(); // Lấy tất cả buổi học từ cơ sở dữ liệu
};

// Lấy buổi học theo ID
export const getMeetingById = async (meetingId: string) => {
  return await Meeting.findById(meetingId); // Lấy buổi học theo ID
};

// Cập nhật buổi học
export const updateMeeting = async (meetingId: string, data: {
  title?: string;
  description?: string;
  meetLink?: string;
  startTime?: Date;
  endTime?: Date;
}) => {
  return await Meeting.findByIdAndUpdate(meetingId, data, { new: true });
};

// Xóa buổi học
export const deleteMeeting = async (meetingId: string) => {
  return await Meeting.findByIdAndDelete(meetingId);
};
