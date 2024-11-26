"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
// Routes cho bài viết
router.post('/posts/:postId/comments', authMiddleware_1.protect, commentController_1.createComment); // Tạo bình luận cho bài viết
router.get('/posts/:postId/comments', commentController_1.getCommentsByPost); // Lấy tất cả comment cho bài viết
router.post('/posts/:postId/comments/:parentCommentId/reply', authMiddleware_1.protect, commentController_1.replyToComment); // Trả lời comment
// Cập nhật và xóa bình luận
router.put('/:commentId', authMiddleware_1.protect, commentController_1.updateComment); // Cập nhật bình luận
router.delete('/:commentId', authMiddleware_1.protect, commentController_1.deleteComment); // Xóa bình luận
// Tạo bình luận với ảnh
router.post('/:postId/comment-with-image', authMiddleware_1.protect, uploadMiddleware_1.uploadFiles, commentController_1.addCommentWithImage);
// Tạo bình luận với ảnh cho video
router.post('/:videoId/comment-with-image', authMiddleware_1.protect, uploadMiddleware_1.uploadFiles, commentController_1.addCommentWithImageToVideo);
// Tạo bình luận cho Resource
router.post('/:resourceId/comments', authMiddleware_1.protect, commentController_1.createCommentForResource);
// Lấy danh sách bình luận dạng cây
router.get('/:resourceId/comments', authMiddleware_1.protect, commentController_1.getCommentsForResource);
// Cập nhật bình luận
router.put('/comments/:commentId', authMiddleware_1.protect, commentController_1.updateCommentForResource);
// Xóa bình luận
router.delete('/comments/:commentId', authMiddleware_1.protect, commentController_1.deleteCommentForResource);
// Lấy tất cả bình luận cho Resource
router.get('/:resourceId/all-comments', authMiddleware_1.protect, commentController_1.getAllCommentsForResource);
//// Trả lời bình luận cho Resource
router.post('/:resourceId/comments/:parentCommentId/replies', authMiddleware_1.protect, commentController_1.replyToCommentForResource);
// Routes cho Subject 
// Tạo bình luận cho Subject
router.post('/subjects/:subjectId', authMiddleware_1.protect, commentController_1.createCommentSubject); // Tạo bình luận cho Subject
// Lấy tất cả comment cho Subject
router.get('/subjects/:subjectId', commentController_1.getCommentsBySubject); // Lấy tất cả comment cho Subject
// Trả lời comment cho Subject
router.post('/subjects/:subjectId/comments/:parentCommentId/reply', authMiddleware_1.protect, commentController_1.replyToCommentSubject); // Trả lời comment
// Cập nhật
router.put('/subjects/comments/:commentId', authMiddleware_1.protect, commentController_1.updateCommentSubject); // Cập nhật bình luận
// Xóa bình luận cho Subject
router.delete('/subjects/comments/:commentId', authMiddleware_1.protect, commentController_1.deleteCommentSubject); // Xóa bình luận
exports.default = router;
