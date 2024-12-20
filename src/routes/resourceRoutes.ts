import express from 'express';
import {
  addResourceToSubject,
  getResourcesForSubject,
  updateResource,
  deleteResource,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  getResourceById,
  getAllResources

} from '../controllers/resourceController';
import { protect } from '../middlewares/authMiddleware';

import { checkPermission } from '../middlewares/permissionMiddleware';
const router = express.Router();

// Lấy tất cả tài liệu với phân trang
router.get('/all-resources', protect, getAllResources);
// fix lỗi id không trùng với id của video

// Tạo tài liệu mới cho môn học
router.post('/:subjectId/resources',protect,checkPermission ('manage_resources'), addResourceToSubject);

// Lấy danh sách tài liệu của môn học với phân trang
router.get('/:subjectId/resources', protect, getResourcesForSubject);

// Cập nhật tài liệu
router.put('/:id', protect,checkPermission ('manage_resources'), updateResource);

// Xóa tài liệu
router.delete('/:id', protect,checkPermission ('manage_resources'), deleteResource);

// Tạo video mới
router.post('/upload-video', protect, checkPermission('manage_videos'), uploadVideo);


// Cập nhật video
router.put('/videos/:id', protect, checkPermission('manage_videos'), updateVideo);


// Xóa video
router.delete('/videos/:id', protect, checkPermission('manage_videos'), deleteVideo);

// Lấy danh sách video
router.get('/videos', protect, getAllVideos);

// Lấy video theo id
router.get('/videos/:id', protect, getVideoById);

// Lấy tài liệu theo id
router.get('/:id', protect, getResourceById);


export default router;
