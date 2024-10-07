import express from 'express';
import { addRating, getAverageRating } from '../controllers/ratingController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/videos/:videoId', protect, addRating);  // Gửi đánh giá
router.get('/videos/:videoId', getAverageRating);  // Lấy điểm trung bình

export default router;
