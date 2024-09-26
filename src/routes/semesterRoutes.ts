import express from 'express';
import { addSemesterToDepartment, getSemesters, updateSemester, deleteSemester } from '../controllers/semesterController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:departmentId/semesters', protect, admin, addSemesterToDepartment); // Tạo học kỳ
router.get('/', protect, getSemesters); // Lấy danh sách học kỳ
router.put('/:id', protect, admin, updateSemester); // Cập nhật học kỳ
router.delete('/:id', protect, admin, deleteSemester); // Xóa học kỳ

export default router;
