import { Request, Response } from 'express';
import {
  createDepartment,
  getDepartments as getDepartmentsService,
  updateDepartment as updateDepartmentService,
  deleteDepartment as deleteDepartmentService,
} from '../services/departmentService';

// Thêm ngành học mới
export const addDepartment = async (req: Request, res: Response) => {
  try {
    const department = await createDepartment(req.body); // Tạo ngành học
    res.status(201).json(department); // Trả về dữ liệu ngành học vừa tạo
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy danh sách ngành học
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await getDepartmentsService(); // Gọi hàm từ service
    res.status(200).json(departments); // Trả về danh sách ngành học
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Cập nhật ngành học
export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const department = await updateDepartmentService(id, req.body); // Gọi hàm từ service
    if (!department) return res.status(404).json({ message: 'Ngành học không tồn tại' });
    res.status(200).json(department); // Trả về dữ liệu ngành học vừa cập nhật
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Xóa ngành học
export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const department = await deleteDepartmentService(id); // Gọi hàm từ service
    if (!department) return res.status(404).json({ message: 'Ngành học không tồn tại' });
    res.status(200).json({ message: 'Ngành học đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};
