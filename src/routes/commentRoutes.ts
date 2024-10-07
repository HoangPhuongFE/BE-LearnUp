import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { createComment, getCommentsByPost, updateComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

router.post('/:postId/comments', protect, createComment);
router.get('/posts/:postId', protect, getCommentsByPost);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);



export default router;
