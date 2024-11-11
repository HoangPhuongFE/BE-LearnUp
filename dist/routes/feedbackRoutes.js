"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router({ mergeParams: true });
// Người dùng có thể xem feedback
router.get('/', feedbackController_1.getFeedbackByMedia);
// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', authMiddleware_1.protect, feedbackController_1.createFeedback);
router.put('/:feedbackId', authMiddleware_1.protect, feedbackController_1.updateFeedback);
router.delete('/:feedbackId', authMiddleware_1.protect, feedbackController_1.deleteFeedback);
exports.default = router;
