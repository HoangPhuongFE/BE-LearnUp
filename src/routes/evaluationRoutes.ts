import express from 'express';
import {
  createOrUpdateEvaluation,
  getEvaluationsByMedia,
  deleteEvaluation,
} from '../controllers/evaluationController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';


const router = express.Router({ mergeParams: true });

// Người dùng có thể xem evaluation
router.get('/', getEvaluationsByMedia);

// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', protect, checkPermission('create_evaluation'), createOrUpdateEvaluation);
router.delete('/:evaluationId', protect, checkPermission('delete_evaluation'), deleteEvaluation);

export default router;
