import { Request, Response } from 'express';
import {
  createSemester,
  getSemesters as getSemestersService,
  updateSemester as updateSemesterService,
  deleteSemester as deleteSemesterService,
  getSemesterById as getSemesterByIdService,
  getSemesterWithDepartmentService,
} from '../services/semesterService';

// Thêm học kỳ vào ngành học
export const addSemesterToDepartment = async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  const { name } = req.body;
  try {
    const semester = await createSemester(departmentId, name);
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Lấy danh sách học kỳ
export const getSemesters = async (req: Request, res: Response) => {
  try {
    const semesters = await getSemestersService();
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Cập nhật học kỳ
export const updateSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await updateSemesterService(id, req.body);
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Xóa học kỳ
export const deleteSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await deleteSemesterService(id);
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json({ message: 'Học kỳ đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Lấy học kỳ theo id
export const getSemesterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await getSemesterByIdService(id);
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Lấy học kỳ và thông tin ngành học
export const getSemesterWithDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await getSemesterWithDepartmentService(id);
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
