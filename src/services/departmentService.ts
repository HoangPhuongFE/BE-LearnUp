import Department from '../models/Department';

export const createDepartment = async (data: { name?: string; code?: string }) => {
  const department = new Department(data);
  return await department.save();
};

export const getDepartments = async () => {
  return await Department.find().populate('semesters');
};

export const updateDepartment = async (id: string, data: { name?: string; code?: string }) => {
  return await Department.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDepartment = async (id: string) => {
  return await Department.findByIdAndDelete(id);
};
