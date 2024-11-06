"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
router.post('/:semesterId/subjects', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_subjects'), subjectController_1.addSubjectToSemester); // Tạo môn học
router.get('/', subjectController_1.getSubjects); // Lấy danh sách môn học
router.put('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_subjects'), subjectController_1.updateSubject); // Cập nhật môn học
router.delete('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_subjects'), subjectController_1.deleteSubject); // Xóa môn học
router.get('/:id', authMiddleware_1.protect, subjectController_1.getSubjectById); // Lấy môn học theo id
router.get('/:id/semester', authMiddleware_1.protect, subjectController_1.getSubjectWithSemester); // Lấy môn học và thông tin học kỳ
exports.default = router;
