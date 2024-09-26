import express from 'express';
import { addSubjectToSemester, getSubjects, updateSubject, deleteSubject } from '../controllers/subjectController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:semesterId/subjects', protect, admin, addSubjectToSemester); // Tạo môn học
router.get('/', protect, getSubjects); // Lấy danh sách môn học
router.put('/:id', protect, admin, updateSubject); // Cập nhật môn học
router.delete('/:id', protect, admin, deleteSubject); // Xóa môn học

export default router;
