import { Request, Response } from 'express';
import {
  createSubject,
  getSubjects as getSubjectsService,
  updateSubject as updateSubjectService,
  deleteSubject as deleteSubjectService,
  getSubjectById as getSubjectByIdService,
  getSubjectWithSemesterService
} from '../services/subjectService';

// Thêm môn học vào học kỳ
export const addSubjectToSemester = async (req: Request, res: Response) => {
  const { semesterId } = req.params;
  const { name , description } = req.body;
  try {
    const subject = await createSubject(semesterId, name , description); // Tạo môn học
    res.status(201).json(subject); // Trả về dữ liệu môn học vừa tạo
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy danh sách môn học
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await getSubjectsService(); // Gọi hàm từ service để lấy danh sách môn học
    res.status(200).json(subjects); // Trả về danh sách môn học
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Cập nhật môn học
export const updateSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subject = await updateSubjectService(id, req.body); // Cập nhật môn học
    if (!subject) return res.status(404).json({ message: 'Môn học không tồn tại' });
    res.status(200).json(subject); // Trả về dữ liệu môn học vừa cập nhật
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Xóa môn học
export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subject = await deleteSubjectService(id); // Xóa môn học
    if (!subject) return res.status(404).json({ message: 'Môn học không tồn tại' });
    res.status(200).json({ message: 'Môn học đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy môn học theo id
export const getSubjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subject = await getSubjectByIdService(id); // Lấy môn học theo id
    if (!subject) return res.status(404).json({ message: 'Môn học không tồn tại' });
    res.status(200).json(subject); // Trả về dữ liệu môn học
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};


// Lấy môn học với học kỳ
export const getSubjectWithSemester = async (req: Request, res: Response) => {
  const { id } = req.params; // Sử dụng `id` vì nó được truyền dưới dạng `:id` trong route
  try {
    const subject = await getSubjectWithSemesterService(id); // Sử dụng đúng tham số id
    if (!subject) {
      return res.status(404).json({ message: 'Môn học không tồn tại' });
    }
    res.status(200).json(subject); // Trả về dữ liệu môn học với học kỳ
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};
