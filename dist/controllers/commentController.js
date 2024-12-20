"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToCommentForSubject = exports.deleteCommentForSubject = exports.updateCommentForSubject = exports.getCommentsForSubject = exports.createCommentForSubject = exports.replyToCommentForResource = exports.getAllCommentsForResource = exports.deleteCommentForResource = exports.updateCommentForResource = exports.getCommentsForResource = exports.createCommentForResource = exports.addCommentWithImageToVideo = exports.addCommentWithImage = exports.deleteComment = exports.updateComment = exports.replyToComment = exports.getCommentsByPost = exports.createComment = void 0;
const CommentService = __importStar(require("../services/commentService"));
const Comment_1 = __importDefault(require("../models/Comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, images } = req.body;
    // Log để debug
    console.log("Raw request body:", req.body);
    console.log("Content type:", req.headers['content-type']);
    console.log("Images before processing:", images);
    try {
        // Kiểm tra và xử lý images
        let processedImages = images;
        // Nếu images là string (có thể xảy ra khi gửi qua form-data), thử parse nó
        if (typeof images === 'string') {
            try {
                processedImages = JSON.parse(images);
            }
            catch (_b) {
                // Nếu không parse được, có thể nó đã là string array
                processedImages = [images];
            }
        }
        // Đảm bảo processedImages là array
        if (!Array.isArray(processedImages)) {
            processedImages = [processedImages].filter(Boolean);
        }
        // Làm phẳng array và loại bỏ các giá trị null/undefined/empty
        processedImages = processedImages
            .flat()
            .filter((img) => img && typeof img === 'string' && img.trim() !== '');
        console.log("Processed images:", processedImages);
        const comment = yield Comment_1.default.create({
            content,
            images: processedImages,
            authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            postId: req.params.postId,
        });
        console.log("Created comment:", comment);
        return res.status(201).json(comment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({
            message: "Error creating comment",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createComment = createComment;
// Lấy tất cả bình luận cho một bài viết hoặc video
const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const comments = yield Comment_1.default.find({ postId })
            .populate('authorId', 'name') // Thêm thông tin tác giả
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Unknown error occurred', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.getCommentsByPost = getCommentsByPost;
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, parentCommentId } = req.params;
    const { content, images } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const reply = yield CommentService.replyToComment(postId, parentCommentId, authorId, content, images);
        res.status(201).json(reply);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.replyToComment = replyToComment;
// Cập nhật bình luận
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const { content, images } = req.body; // Lấy thêm `images` từ request body
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID người dùng hiện tại
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role; // Vai trò người dùng (admin hoặc user)
    try {
        // Lấy thông tin bình luận
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        // Kiểm tra quyền: Chỉ người tạo hoặc admin mới được cập nhật
        // if (comment.authorId.toString() !== userId && userRole !== 'admin') {
        //    return res.status(403).json({ message: 'Không có quyền cập nhật bình luận này' });
        // }
        // Thực hiện cập nhật
        const updatedComment = yield CommentService.updateComment(commentId, content, images);
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.updateComment = updateComment;
// Xóa bình luận
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID của người dùng hiện tại
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role; // Vai trò người dùng (admin hoặc user)
    try {
        // Lấy thông tin bình luận
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        // Kiểm tra quyền: Chỉ người tạo hoặc admin mới được xóa
        //  if (comment.authorId.toString() !== userId && userRole !== 'admin') {
        //    return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
        //   }
        // Thực hiện xóa bình luận
        yield CommentService.deleteComment(commentId);
        res.status(200).json({ message: 'Comment đã được xóa thành công' });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.deleteComment = deleteComment;
// Thêm bình luận với ảnh 
const addCommentWithImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { content, imageUrls } = req.body; // FE gửi imageUrls (các URL của file đã tải lên Cloudinary)
    const userId = req.user ? req.user._id : null;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Lưu bình luận với URLs đã nhận từ FE
        const newComment = new Comment_1.default({
            postId,
            authorId: userId,
            content,
            images: imageUrls, // Lưu URL ảnh mà FE đã gửi
        });
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.addCommentWithImage = addCommentWithImage;
// Thêm bình luận với ảnh đính kèm cho video
const addCommentWithImageToVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params; // Lấy videoId từ URL
    const { content, imageUrls } = req.body; // Lấy nội dung và URL ảnh từ body của request
    const userId = req.user ? req.user._id : null;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Lưu bình luận với URLs đã nhận từ FE
        const newComment = new Comment_1.default({
            videoId,
            authorId: userId,
            content,
            images: imageUrls, // Lưu URL ảnh mà FE đã gửi
        });
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.addCommentWithImageToVideo = addCommentWithImageToVideo;
// Tạo bình luận cho Resource
const createCommentForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { resourceId } = req.params;
    const { content, images } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    try {
        const comment = yield CommentService.createCommentForResource(resourceId, {
            content,
            authorId,
            images
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.createCommentForResource = createCommentForResource;
/*
// Lấy bình luận theo Resource ID
export const getCommentsForResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  try {
    const comments = await CommentService.getCommentsByResource(resourceId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};
*/
// Lấy danh sách bình luận theo cấu trúc cây
const getCommentsForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resourceId } = req.params;
    try {
        const comments = yield CommentService.getCommentsTreeForResource(resourceId);
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.getCommentsForResource = getCommentsForResource;
// Cập nhật bình luận với kiểm tra quyền
const updateCommentForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID người dùng hiện tại
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role; // Vai trò người dùng (admin hoặc user)
    if (!content) {
        return res.status(400).json({ message: 'Content không được để trống' });
    }
    try {
        // Lấy thông tin bình luận
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        // Kiểm tra quyền
        if (comment.authorId.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền cập nhật bình luận này' });
        }
        // Thực hiện cập nhật
        const updatedComment = yield CommentService.updateResourceComment(commentId, content);
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.updateCommentForResource = updateCommentForResource;
// Xóa bình luận với kiểm tra quyền
const deleteCommentForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID của người dùng đang đăng nhập
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role; // Vai trò người dùng (ví dụ: 'admin' hoặc 'user')
    try {
        // Lấy thông tin bình luận
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        // Kiểm tra quyền
        if (comment.authorId.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
        }
        // Xóa bình luận (và các bình luận con)
        const deletedComment = yield CommentService.deleteResourceComment(commentId);
        res.status(200).json({ message: 'Comment và các trả lời của nó đã được xóa', deletedComment });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.deleteCommentForResource = deleteCommentForResource;
const getAllCommentsForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resourceId } = req.params;
    console.log('Resource ID:', resourceId); // Log resourceId để kiểm tra
    try {
        const comments = yield Comment_1.default.find({ resourceId }).populate('authorId', 'name');
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.getAllCommentsForResource = getAllCommentsForResource;
// Trả lời bình luận
const replyToCommentForResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { resourceId, parentCommentId } = req.params;
    const { content, images } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    try {
        const replyComment = yield CommentService.replyToCommentForResource(resourceId, parentCommentId, {
            content,
            authorId,
            images,
        });
        res.status(201).json(replyComment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.replyToCommentForResource = replyToCommentForResource;
// Create a comment for a subject
const createCommentForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subjectId } = req.params;
    const { content, images } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    try {
        const comment = yield CommentService.createCommentForSubject(subjectId, {
            content,
            authorId,
            images,
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.createCommentForSubject = createCommentForSubject;
// Get comments for a subject
const getCommentsForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId } = req.params;
    try {
        const comments = yield Comment_1.default.find({ subjectId })
            .populate('authorId', 'name') // Thêm thông tin tác giả
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Unknown error occurred', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.getCommentsForSubject = getCommentsForSubject;
// Update a comment for a subject
const updateCommentForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const { content, images } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    try {
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.authorId.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update this comment' });
        }
        const updatedComment = yield CommentService.updateSubjectComment(commentId, content, images);
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.updateCommentForSubject = updateCommentForSubject;
// Delete a comment for a subject
const deleteCommentForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    try {
        const comment = yield CommentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.authorId.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }
        yield CommentService.deleteSubjectComment(commentId);
        res.status(200).json({ message: 'Comment and its replies have been deleted' });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.deleteCommentForSubject = deleteCommentForSubject;
// Reply to a comment on a subject
const replyToCommentForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subjectId, parentCommentId } = req.params;
    const { content, images } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    try {
        const replyComment = yield CommentService.replyToCommentForSubject(subjectId, parentCommentId, {
            content,
            authorId,
            images,
        });
        res.status(201).json(replyComment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
exports.replyToCommentForSubject = replyToCommentForSubject;
