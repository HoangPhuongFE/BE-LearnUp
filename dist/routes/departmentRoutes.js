"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentController_1 = require("../controllers/departmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_departments'), departmentController_1.addDepartment); // Tạo ngành học
router.get('/', departmentController_1.getDepartments); // Lấy danh sách ngành học
router.put('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_departments'), departmentController_1.updateDepartment); // Cập nhật ngành học
router.delete('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_departments'), departmentController_1.deleteDepartment); // Xóa ngành học
exports.default = router;
