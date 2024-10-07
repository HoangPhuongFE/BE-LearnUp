import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {uploadFiles} from '../middlewares/uploadMiddleware';
import { createComment, getCommentsByPost, updateComment, deleteComment, addCommentWithImage } from '../controllers/commentController';

const router = express.Router();

router.post('/:postId/comments', protect, createComment);
router.post('/:postId/comment-with-image', protect,uploadFiles, addCommentWithImage);  
router.get('/posts/:postId', protect, getCommentsByPost);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
