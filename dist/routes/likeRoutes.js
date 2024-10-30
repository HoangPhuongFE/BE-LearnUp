"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const likeController_1 = require("../controllers/likeController");
const router = express_1.default.Router();
router.post('/:postId/likes', authMiddleware_1.protect, likeController_1.toggleLike);
router.get('/:postId', authMiddleware_1.protect, likeController_1.getLikesByPost);
exports.default = router;
