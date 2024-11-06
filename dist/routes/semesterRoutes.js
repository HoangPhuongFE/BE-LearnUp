"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semesterController_1 = require("../controllers/semesterController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
router.post('/:departmentId/semesters', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_semesters'), semesterController_1.addSemesterToDepartment); // Tạo học kỳ
router.get('/', semesterController_1.getSemesters); // Lấy danh sách học kỳ
router.put('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_semesters'), semesterController_1.updateSemester); // Cập nhật học kỳ
router.delete('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_semesters'), semesterController_1.deleteSemester); // Xóa học kỳ
router.get('/:id', authMiddleware_1.protect, semesterController_1.getSemesterById); // Lấy học kỳ theo id
router.get('/:id/department', authMiddleware_1.protect, semesterController_1.getSemesterWithDepartment); // Lấy học kỳ và thông tin ngành học
exports.default = router;
