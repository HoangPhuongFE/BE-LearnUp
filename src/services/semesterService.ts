import Semester from '../models/Semester';
import Department from '../models/Department';
import { ObjectId } from 'mongodb';

export const createSemester = async (departmentId: string, name: string) => {
  // Tạo tài liệu mới cho Semester
  const semester = new Semester({ name });
  await semester.save();

  // Tìm Department theo departmentId và thêm semester._id vào mảng semesters
  const department = await Department.findById(departmentId);
  if (department) {
    // Ép kiểu _id thành ObjectId
    const semesterId = semester._id as ObjectId;

    department.semesters.push(semesterId); // Chỉ thêm ObjectId của semester
    await department.save();
  }

  return semester;
};

export const getSemesters = async () => {
  return await Semester.find().populate('subjects');
};

export const updateSemester = async (id: string, data: { name?: string }) => {
  return await Semester.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSemester = async (id: string) => {
  return await Semester.findByIdAndDelete(id);
};
