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
exports.addCommentWithImageToVideo = exports.addCommentWithImage = exports.deleteComment = exports.updateComment = exports.getCommentsByPostOrVideo = exports.createComment = void 0;
const CommentService = __importStar(require("../services/commentService"));
const Comment_1 = __importDefault(require("../models/Comment"));
// Tạo bình luận mới
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content } = req.body;
    const { postId, videoId } = req.params; // Lấy cả postId và videoId từ params
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        let commentData = { content, authorId };
        if (postId) {
            commentData.postId = postId;
        }
        else if (videoId) {
            commentData.videoId = videoId;
        }
        else {
            return res.status(400).json({ message: 'Cần có postId hoặc videoId' });
        }
        const comment = yield CommentService.createComment(commentData);
        res.status(201).json(comment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error creating comment', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.createComment = createComment;
// Lấy tất cả bình luận cho một bài viết hoặc video
const getCommentsByPostOrVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, videoId } = req.params;
    try {
        let comments;
        if (postId) {
            comments = yield CommentService.getCommentsByPost(postId);
        }
        else if (videoId) {
            comments = yield CommentService.getCommentsByVideo(videoId);
        }
        else {
            return res.status(400).json({ message: 'Cần có postId hoặc videoId' });
        }
        res.status(200).json(comments);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching comments', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.getCommentsByPostOrVideo = getCommentsByPostOrVideo;
// Cập nhật bình luận
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { content } = req.body;
    try {
        const updatedComment = yield CommentService.updateComment(commentId, content);
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error updating comment', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.updateComment = updateComment;
// Xóa bình luận
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const deletedComment = yield CommentService.deleteComment(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment không tồn tại' });
        }
        res.status(200).json({ message: 'Comment đã được xóa thành công' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error deleting comment', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
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
