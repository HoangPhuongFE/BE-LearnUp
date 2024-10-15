import express from 'express';
import { addSubjectToSemester, getSubjects, updateSubject, deleteSubject ,getSubjectById,getSubjectWithSemester } from '../controllers/subjectController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';

const router = express.Router();

router.post('/:semesterId/subjects', protect, checkPermission ('manage_subjects'),addSubjectToSemester); // Tạo môn học
router.get('/', protect, getSubjects); // Lấy danh sách môn học
router.put('/:id', protect,checkPermission ('manage_subjects'), updateSubject); // Cập nhật môn học
router.delete('/:id', protect, checkPermission ('manage_subjects'),deleteSubject); // Xóa môn học
router.get('/:id', protect, getSubjectById); // Lấy môn học theo id
router.get('/:id/semester', protect, getSubjectWithSemester); // Lấy môn học và thông tin học kỳ
export default router;
