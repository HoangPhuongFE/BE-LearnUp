import Subject from '../models/Subject';
import Semester from '../models/Semester';
import { ObjectId } from 'mongodb';

export const createSubject = async (semesterId: string, name: string) => {
  // Tạo tài liệu mới cho Subject
  const subject = new Subject({ name });
  await subject.save();

  // Tìm Semester theo semesterId và thêm subject._id vào mảng subjects
  const semester = await Semester.findById(semesterId);
  if (semester) {
    // Ép kiểu _id thành ObjectId
    const subjectId = subject._id as ObjectId;
    
    semester.subjects.push(subjectId); // Chỉ thêm ObjectId của subject
    await semester.save();
  }

  return subject;
};

export const getSubjects = async () => {
  return await Subject.find().populate('resources');
};

export const updateSubject = async (id: string, data: { name?: string }) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSubject = async (id: string) => {
  return await Subject.findByIdAndDelete(id);
};
