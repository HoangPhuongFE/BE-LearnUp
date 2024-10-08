import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {uploadFiles} from '../middlewares/uploadMiddleware';
import { createComment,
     getCommentsByPostOrVideo,
      updateComment,
       deleteComment,
       addCommentWithImage ,
       addCommentWithImageToVideo 
    } from '../controllers/commentController';

const router = express.Router();

// Routes cho bài viết
router.post('/posts/:postId/comments', protect, createComment); // Tạo bình luận cho bài viết
router.get('/posts/:postId/comments', protect, getCommentsByPostOrVideo); // Lấy bình luận cho bài viết

// Routes cho video
router.post('/videos/:videoId/comments', protect, createComment); // Tạo bình luận cho video
router.get('/videos/:videoId/comments', protect, getCommentsByPostOrVideo); // Lấy bình luận cho video

// Cập nhật và xóa bình luận
router.put('/:commentId', protect, updateComment); // Cập nhật bình luận
router.delete('/:commentId', protect, deleteComment); // Xóa bình luận

// Tạo bình luận với ảnh
router.post('/:postId/comment-with-image', protect,uploadFiles, addCommentWithImage);  


// Tạo bình luận với ảnh cho video
router.post('/:videoId/comment-with-image', protect,uploadFiles, addCommentWithImageToVideo);



export default router;
