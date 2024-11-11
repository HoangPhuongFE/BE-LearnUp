import express from 'express';
import {
  createFeedback,
  getFeedbackByMedia,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';

const router = express.Router({ mergeParams: true });

// Người dùng có thể xem feedback
router.get('/', getFeedbackByMedia);

// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', protect, createFeedback);
router.put('/:feedbackId', protect, updateFeedback);
router.delete('/:feedbackId', protect, deleteFeedback);

export default router;
