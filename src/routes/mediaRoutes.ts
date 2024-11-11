import express from 'express';
import {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
} from '../controllers/mediaController';
import { protect} from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import feedbackRoutes from '../routes/feedbackRoutes';
import evaluationRoutes from '../routes/evaluationRoutes';

const router = express.Router();

// Các tuyến đường công khai cho người dùng xem
router.get('/allmedia', getAllMedia);
router.get('/:id', getMediaById);

// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', protect, checkPermission('manage_media'), createMedia);
router.put('/update/:id', protect, checkPermission('manage_media'), updateMedia);
router.delete('/delete/:id', protect, checkPermission('manage_media'), deleteMedia);

// Các tuyến đường lồng cho feedback và evaluation
router.use('/:mediaId/feedback',protect, feedbackRoutes);
router.use('/:mediaId/evaluation', protect,evaluationRoutes);

export default router;
