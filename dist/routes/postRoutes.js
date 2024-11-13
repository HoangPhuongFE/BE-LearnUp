"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const postController_1 = require("../controllers/postController");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_post'), postController_1.createPost);
router.get('/', postController_1.getPosts);
router.put('/:postId', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_post'), postController_1.updatePost);
router.delete('/:postId', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_post'), postController_1.deletePost);
router.get('/search', postController_1.searchPosts);
router.get('/:postId', authMiddleware_1.protect, postController_1.getPostById);
exports.default = router;
