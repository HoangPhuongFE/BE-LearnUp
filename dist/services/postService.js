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
exports.searchPosts = exports.deletePost = exports.updatePost = exports.getPosts = exports.createPost = void 0;
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPost = (title, content, tags, image, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    // Kiểm tra xem authorId có phải là ObjectId hợp lệ không
    if (!mongoose_1.default.Types.ObjectId.isValid(authorId)) {
        throw new Error('Invalid author ID');
    }
    const post = new Post_1.default({
        title,
        content,
        tags,
        image,
        authorId: new mongoose_1.default.Types.ObjectId(authorId) // Đảm bảo là ObjectId
    });
    yield post.save();
    return post;
});
exports.createPost = createPost;
const getPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.default.find().populate('authorId', 'name');
});
exports.getPosts = getPosts;
const updatePost = (postId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.default.findByIdAndUpdate(postId, updateData, { new: true });
});
exports.updatePost = updatePost;
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.default.findByIdAndDelete(postId);
});
exports.deletePost = deletePost;
// Tìm kiếm bài viết
const searchPosts = (query, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    // Nếu người dùng nhập từ khóa tìm kiếm
    if (query) {
        // Sử dụng $regex để tìm kiếm gần đúng
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
        ];
    }
    // Nếu người dùng nhập hashtag cụ thể
    if (tags && tags.length > 0) {
        filter.tags = { $in: tags };
    }
    const posts = yield Post_1.default.find(filter).sort({ createdAt: -1 }).exec();
    // Nếu không có kết quả, sử dụng FuzzySearch để gợi ý
    if (posts.length === 0 && query) {
        const allPosts = yield Post_1.default.find().exec(); // Lấy tất cả bài viết
        const searcher = new fuzzy_search_1.default(allPosts, ['title', 'tags'], {
            caseSensitive: false,
            sort: true,
        });
        const fuzzyResults = searcher.search(query); // Gợi ý tìm kiếm
        return { suggestions: fuzzyResults };
    }
    return posts;
});
exports.searchPosts = searchPosts;
