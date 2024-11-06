import express from 'express';
import { addDepartment, getDepartments, updateDepartment, deleteDepartment } from '../controllers/departmentController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';

const router = express.Router();

router.post('/', protect, checkPermission ('manage_departments'), addDepartment); // Tạo ngành học
router.get('/', getDepartments); // Lấy danh sách ngành học
router.put('/:id', protect,checkPermission ('manage_departments'), updateDepartment); // Cập nhật ngành học
router.delete('/:id', protect,checkPermission ('manage_departments'), deleteDepartment); // Xóa ngành học

export default router;
