"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = require("../controllers/ratingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/videos/:videoId', authMiddleware_1.protect, ratingController_1.addRating); // Gửi đánh giá
router.get('/videos/:videoId', ratingController_1.getAverageRating); // Lấy điểm trung bình
exports.default = router;
