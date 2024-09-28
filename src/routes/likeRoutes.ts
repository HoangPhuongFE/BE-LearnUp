import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { toggleLike, getLikesByPost } from '../controllers/likeController';

const router = express.Router();

router.post('/:postId/likes', protect, toggleLike);
router.get('/:postId', protect, getLikesByPost);

export default router;
