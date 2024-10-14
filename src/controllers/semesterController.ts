import { Request, Response } from 'express';
import {
  createSemester,
  getSemesters as getSemestersService,
  updateSemester as updateSemesterService,
  deleteSemester as deleteSemesterService,
  getSemesterById as getSemesterByIdService
} from '../services/semesterService';

// Thêm học kỳ vào ngành học
export const addSemesterToDepartment = async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  const { name } = req.body;
  try {
    const semester = await createSemester(departmentId, name); // Tạo học kỳ
    res.status(201).json(semester); // Trả về dữ liệu học kỳ vừa tạo
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy danh sách học kỳ
export const getSemesters = async (req: Request, res: Response) => {
  try {
    const semesters = await getSemestersService(); // Gọi hàm từ service
    res.status(200).json(semesters); // Trả về danh sách học kỳ
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Cập nhật học kỳ
export const updateSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await updateSemesterService(id, req.body); // Gọi hàm từ service để cập nhật học kỳ
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json(semester); // Trả về dữ liệu học kỳ vừa cập nhật
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Xóa học kỳ
export const deleteSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await deleteSemesterService(id); // Gọi hàm từ service để xóa học kỳ
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json({ message: 'Học kỳ đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy học kỳ theo id
export const getSemesterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await getSemesterByIdService(id); // Gọi service với 1 tham số là id
    if (!semester) return res.status(404).json({ message: 'Học kỳ không tồn tại' });
    res.status(200).json(semester); // Trả về dữ liệu học kỳ
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};


