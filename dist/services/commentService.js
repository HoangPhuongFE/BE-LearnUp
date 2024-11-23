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
exports.getCommentById = exports.getCommentsTreeForResource = exports.replyToCommentForResource = exports.updateResourceComment = exports.deleteResourceComment = exports.createCommentForResource = exports.deleteComment = exports.updateComment = exports.getCommentsByVideo = exports.getCommentsByPost = exports.createComment = void 0;
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
// Tạo bình luận cho Resource
const createCommentForResource = (resourceId, commentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Kiểm tra dữ liệu đầu vào
    if (!resourceId) {
        throw new Error('Resource ID is required');
    }
    if (!commentData.content || typeof commentData.content !== 'string') {
        throw new Error('Content is required and must be a string');
    }
    if (!commentData.authorId) {
        throw new Error('Author ID is required');
    }
    // Tạo bình luận
    const comment = new Comment_1.default({
        resourceId,
        content: commentData.content,
        authorId: commentData.authorId,
        images: commentData.images || [], // Mặc định là mảng rỗng nếu không có hình ảnh
    });
    // Lưu bình luận vào MongoDB
    try {
        return yield comment.save();
    }
    catch (error) {
        throw new Error('Failed to create comment: ' + error.message);
    }
});
exports.createCommentForResource = createCommentForResource;
/*

// Lấy danh sách bình luận theo Resource ID
export const getCommentsByResource = async (resourceId: string) => {
  return await Comment.find({ resourceId }).populate('authorId', 'name'); // Liên kết với tác giả
};
*/
// Xóa bình luận và tất cả bình luận con
const deleteResourceComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Tìm tất cả các bình luận con liên quan đến commentId
    const childComments = yield Comment_1.default.find({ parentCommentId: commentId });
    // Xóa từng bình luận con và các bình luận con của nó (đệ quy)
    for (const childComment of childComments) {
        yield (0, exports.deleteResourceComment)(childComment._id.toString());
    }
    // Cuối cùng xóa bình luận hiện tại (cha)
    return yield Comment_1.default.findByIdAndDelete(commentId);
});
exports.deleteResourceComment = deleteResourceComment;
// Cập nhật bình luận theo ID
const updateResourceComment = (commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.findByIdAndUpdate(commentId, { content, updatedAt: new Date() }, // Cập nhật nội dung và thời gian
    { new: true } // Trả về dữ liệu đã cập nhật
    );
});
exports.updateResourceComment = updateResourceComment;
// Trả lời bình luận cho Resource
const replyToCommentForResource = (resourceId, parentCommentId, commentData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!resourceId || !parentCommentId) {
        throw new Error('Resource ID and Parent Comment ID are required');
    }
    const replyComment = new Comment_1.default({
        resourceId,
        parentCommentId,
        content: commentData.content,
        authorId: commentData.authorId,
        images: commentData.images || [],
    });
    try {
        return yield replyComment.save();
    }
    catch (error) {
        throw new Error('Failed to reply to comment: ' + error.message);
    }
});
exports.replyToCommentForResource = replyToCommentForResource;
// Lấy danh sách bình luận dạng cây cho Resource
const getCommentsTreeForResource = (resourceId) => __awaiter(void 0, void 0, void 0, function* () {
    // Lấy bình luận gốc
    const rootComments = yield Comment_1.default.find({ resourceId, parentCommentId: null }).populate('authorId', 'name');
    // Lấy tất cả trả lời
    const replies = yield Comment_1.default.find({ resourceId, parentCommentId: { $ne: null } }).populate('authorId', 'name');
    // Xây dựng cây bình luận
    const commentTree = rootComments.map((comment) => {
        const commentReplies = replies.filter((reply) => { var _a; return ((_a = reply.parentCommentId) === null || _a === void 0 ? void 0 : _a.toString()) === comment._id.toString(); });
        return Object.assign(Object.assign({}, comment.toObject()), { replies: commentReplies });
    });
    return commentTree;
});
exports.getCommentsTreeForResource = getCommentsTreeForResource;
// Lấy thông tin bình luận theo ID
const getCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.default.findById(commentId).populate('authorId', 'name role'); // Có thể lấy thêm thông tin người tạo
});
exports.getCommentById = getCommentById;
