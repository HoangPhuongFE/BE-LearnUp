import Semester from '../models/Semester';
import Department from '../models/Department';
import { ObjectId } from 'mongodb';

export const createSemester = async (departmentId: string, name: string) => {
  const semester = new Semester({ name, department: departmentId });  // Gán departmentId
  await semester.save();

  const department = await Department.findById(departmentId);
  if (department) {
    department.semesters.push(semester._id as ObjectId);
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

export const getSemesterById = async (id: string) => {
  return await Semester.findById(id).populate('subjects');
};


export const getSemesterWithDepartmentService = async (semesterId: string) => {
  try {
    const semester = await Semester.findById(semesterId)
      .populate({
        path: 'department',  // Populate để lấy thông tin ngành học
        select: 'name code',  // Chỉ lấy tên và mã ngành học
      })
     // .populate('subjects');  // Populate các môn học
    return semester;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
