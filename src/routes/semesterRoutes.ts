import express from 'express';
import { addSemesterToDepartment, getSemesters, updateSemester, deleteSemester , getSemesterById ,getSemesterWithDepartment} from '../controllers/semesterController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
const router = express.Router();

router.post('/:departmentId/semesters', protect,checkPermission ('manage_semesters'), addSemesterToDepartment); // Tạo học kỳ
router.get('/',  getSemesters); // Lấy danh sách học kỳ
router.put('/:id', protect,checkPermission ('manage_semesters'), updateSemester); // Cập nhật học kỳ
router.delete('/:id', protect,checkPermission ('manage_semesters'), deleteSemester); // Xóa học kỳ
router.get('/:id', protect, getSemesterById); // Lấy học kỳ theo id
router.get('/:id/department', protect, getSemesterWithDepartment); // Lấy học kỳ và thông tin ngành học

export default router;
