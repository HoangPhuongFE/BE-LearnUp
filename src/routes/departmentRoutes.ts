import express from 'express';
import { addDepartment, getDepartments, updateDepartment, deleteDepartment } from '../controllers/departmentController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, admin, addDepartment); // Tạo ngành học
router.get('/', protect, getDepartments); // Lấy danh sách ngành học
router.put('/:id', protect, admin, updateDepartment); // Cập nhật ngành học
router.delete('/:id', protect, admin, deleteDepartment); // Xóa ngành học

export default router;
