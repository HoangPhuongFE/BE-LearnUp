"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const meetingController_1 = require("../controllers/meetingController");
const router = express_1.default.Router();
// Tạo buổi học mới
router.post('/', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_meetings'), meetingController_1.createMeeting);
// Lấy danh sách tất cả buổi học
router.get('/', authMiddleware_1.protect, meetingController_1.getMeetings);
// Lấy buổi học theo ID
router.get('/:meetingId', authMiddleware_1.protect, meetingController_1.getMeetingById);
// Cập nhật buổi học
router.put('/:meetingId', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_meetings'), meetingController_1.updateMeeting);
// Xóa buổi học
router.delete('/:meetingId', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_meetings'), meetingController_1.deleteMeeting);
exports.default = router;
