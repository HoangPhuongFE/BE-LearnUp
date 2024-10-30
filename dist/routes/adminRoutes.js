"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
// Lấy danh sách người dùng
router.get('/users', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_users'), adminController_1.getUsers);
// Cập nhật vai trò và quyền của người dùng
router.put('/user/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_users'), adminController_1.updateUserRoleAndPermissions);
// Xóa người dùng
router.delete('/user/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_users'), adminController_1.deleteUser);
// Nâng cấp tài khoản từ free lên premium
router.put('/user/:id/upgrade', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_users'), adminController_1.upgradeToPremium);
exports.default = router;
