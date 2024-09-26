import express from 'express';
import {
  addResourceToSubject,
  getResourcesForSubject,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Tạo tài liệu mới cho môn học
router.post('/:subjectId/resources', protect, admin, addResourceToSubject);

// Lấy danh sách tài liệu của môn học với phân trang
router.get('/:subjectId/resources', protect, getResourcesForSubject);

// Cập nhật tài liệu
router.put('/:id', protect, admin, updateResource);

// Xóa tài liệu
router.delete('/:id', protect, admin, deleteResource);

export default router;
