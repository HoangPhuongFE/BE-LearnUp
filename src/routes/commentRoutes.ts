import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { uploadFiles } from '../middlewares/uploadMiddleware';
import {
    createComment,
    updateComment,
    deleteComment,
    addCommentWithImage,
    addCommentWithImageToVideo,
    createCommentForResource,
    getCommentsForResource,
    updateCommentForResource,
    deleteCommentForResource,
    getAllCommentsForResource,
    replyToCommentForResource,
    getCommentsByPost,
    replyToComment,
    createCommentSubject,
    getCommentsBySubject,
    replyToCommentSubject,
    updateCommentSubject,
    deleteCommentSubject,


} from '../controllers/commentController';

const router = express.Router();

// Routes cho bài viết
router.post('/posts/:postId/comments', protect, createComment); // Tạo bình luận cho bài viết


router.get('/posts/:postId/comments', getCommentsByPost); // Lấy tất cả comment cho bài viết

router.post('/posts/:postId/comments/:parentCommentId/reply', protect, replyToComment); // Trả lời comment

// Cập nhật và xóa bình luận
router.put('/:commentId', protect, updateComment); // Cập nhật bình luận
router.delete('/:commentId', protect, deleteComment); // Xóa bình luận

// Tạo bình luận với ảnh
router.post('/:postId/comment-with-image', protect, uploadFiles, addCommentWithImage);

// Tạo bình luận với ảnh cho video
router.post('/:videoId/comment-with-image', protect, uploadFiles, addCommentWithImageToVideo);


// Tạo bình luận cho Resource
router.post('/:resourceId/comments', protect, createCommentForResource);

// Lấy danh sách bình luận dạng cây
router.get('/:resourceId/comments', protect, getCommentsForResource);

// Cập nhật bình luận
router.put('/comments/:commentId', protect, updateCommentForResource);

// Xóa bình luận
router.delete('/comments/:commentId', protect, deleteCommentForResource);
// Lấy tất cả bình luận cho Resource
router.get('/:resourceId/all-comments', protect, getAllCommentsForResource);

//// Trả lời bình luận cho Resource
router.post('/:resourceId/comments/:parentCommentId/replies', protect, replyToCommentForResource);



// Routes cho Subject 
// Tạo bình luận cho Subject
router.post('/subjects/:subjectId', protect, createCommentSubject); // Tạo bình luận cho Subject

// Lấy tất cả comment cho Subject
router.get('/subjects/:subjectId', getCommentsBySubject); // Lấy tất cả comment cho Subject

// Trả lời comment cho Subject
router.post('/subjects/:subjectId/comments/:parentCommentId/reply', protect, replyToCommentSubject); // Trả lời comment

// Cập nhật
router.put('/subjects/comments/:commentId', protect, updateCommentSubject); // Cập nhật bình luận

// Xóa bình luận cho Subject
router.delete('/subjects/comments/:commentId', protect, deleteCommentSubject); // Xóa bình luận










export default router;
