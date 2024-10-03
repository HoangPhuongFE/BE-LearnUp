import express from 'express';
import {
  addResourceToSubject,
  getResourcesForSubject,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';
import { protect } from '../middlewares/authMiddleware';

import { checkPermission } from '../middlewares/permissionMiddleware';
const router = express.Router();

// Tạo tài liệu mới cho môn học
router.post('/:subjectId/resources',protect,checkPermission ('manage_resources'), addResourceToSubject);

// Lấy danh sách tài liệu của môn học với phân trang
router.get('/:subjectId/resources', protect, getResourcesForSubject);

// Cập nhật tài liệu
router.put('/:id', protect,checkPermission ('manage_resources'), updateResource);

// Xóa tài liệu
router.delete('/:id', protect,checkPermission ('manage_resources'), deleteResource);

export default router;
