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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPosts = exports.deletePost = exports.updatePost = exports.getPosts = exports.createPost = void 0;
const PostService = __importStar(require("../services/postService"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content, tags } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const post = yield PostService.createPost(title, content, tags, authorId);
        res.status(201).json(post);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error creating post', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.createPost = createPost;
// Lấy danh sách bài viết
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield PostService.getPosts();
        res.status(200).json(posts);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching posts', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});
exports.getPosts = getPosts;
// Cập nhật bài viết
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const updatedPost = yield PostService.updatePost(postId, req.body);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error updating post', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});
exports.updatePost = updatePost;
// Xóa bài viết
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const deletedPost = yield PostService.deletePost(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error deleting post', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});
exports.deletePost = deletePost;
// Tìm kiếm bài viết
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, tags } = req.query; // Query và tags từ request query
    try {
        const posts = yield PostService.searchPosts(query, (tags === null || tags === void 0 ? void 0 : tags.split(',')) || []);
        res.status(200).json(posts);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error searching posts', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.searchPosts = searchPosts;
