import Subject from '../models/Subject';
import Semester from '../models/Semester';
import { ObjectId } from 'mongodb';

export const createSubject = async (semesterId: string, name: string,description?:string) => {
  // Tạo tài liệu mới cho Subject và lưu semesterId
  const subject = new Subject({ name,description, semester: semesterId });
  await subject.save();

  // Tìm Semester theo semesterId và thêm subject._id vào mảng subjects
  const semester = await Semester.findById(semesterId);
  if (semester) {
    const subjectId = subject._id as ObjectId;
    semester.subjects.push(subjectId);
    await semester.save();
  }

  return subject;
};


export const getSubjects = async () => {
  return await Subject.find().populate('resources');
};

export const updateSubject = async (id: string, data: { name?: string ; descripton?:string}) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSubject = async (id: string) => {
  return await Subject.findByIdAndDelete(id);
};

export const getSubjectById = async (id: string) => {
  return await Subject.findById(id).populate('resources');
};

export const getSubjectWithSemesterService = async (subjectId: string) => {
  try {
    const subject = await Subject
      .findById(subjectId)
      .populate({
        path: 'semester',
        select: 'name',  // Chỉ lấy tên của học kỳ
      });
    return subject;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
