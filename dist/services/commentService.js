"use strict";
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
exports.deleteComment = exports.updateComment = exports.getCommentsByVideo = exports.getCommentsByPost = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
// Tạo bình luận mới
const createComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, videoId, content, authorId } = commentData;
    const newComment = new Comment_1.default({
        postId,
        videoId,
        content,
        authorId,
    });
    return yield newComment.save();
});
exports.createComment = createComment;
// Lấy bình luận theo postId
const getCommentsByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.find({ postId }).populate('authorId', 'name');
});
exports.getCommentsByPost = getCommentsByPost;
// Lấy bình luận theo videoId
const getCommentsByVideo = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.find({ videoId }).populate('authorId', 'name');
});
exports.getCommentsByVideo = getCommentsByVideo;
// Cập nhật bình luận
const updateComment = (commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.findByIdAndUpdate(commentId, { content }, { new: true });
});
exports.updateComment = updateComment;
// Xóa bình luận
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.findByIdAndDelete(commentId);
});
exports.deleteComment = deleteComment;
