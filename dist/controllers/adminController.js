"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeToPremium = exports.deleteUser = exports.updateUserRoleAndPermissions = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
// controllers/adminController.ts
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Không sử dụng keyword, lấy tất cả người dùng
        const users = yield User_1.default.find().select('-password'); // Lấy tất cả người dùng
        res.status(200).json({
            message: 'Lấy danh sách người dùng thành công',
            users,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: 'Unknown error' });
        }
    }
});
exports.getUsers = getUsers;
// Update user roles and permissions
const updateUserRoleAndPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // User ID
    const { role, permissions } = req.body;
    try {
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (role) {
            user.role = role;
        }
        if (permissions) {
            user.permissions = permissions;
        }
        yield user.save();
        res.status(200).json({
            message: 'User role and permissions updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
            },
        });
    }
    catch (error) {
        // Fix starts here
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error updating user role and permissions', error: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.updateUserRoleAndPermissions = updateUserRoleAndPermissions;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // User ID
    try {
        const user = yield User_1.default.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.deleteUser = deleteUser;
const upgradeToPremium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID của người dùng
    try {
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        // Cập nhật role thành member_premium
        user.role = 'member_premium';
        // Lưu ngày bắt đầu và tính toán ngày hết hạn là 30 ngày kể từ ngày nâng cấp
        const premiumStartDate = new Date();
        const premiumEndDate = new Date();
        premiumEndDate.setDate(premiumEndDate.getDate() + 30);
        user.premiumStartDate = premiumStartDate;
        user.premiumEndDate = premiumEndDate;
        yield user.save();
        res.status(200).json({
            message: 'Nâng cấp tài khoản thành công, tài khoản sẽ hết hạn sau 30 ngày',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                premiumStartDate: user.premiumStartDate, // Gửi thông tin ngày bắt đầu
                premiumEndDate: user.premiumEndDate, // Gửi thông tin ngày hết hạn về cho admin
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Lỗi khi nâng cấp tài khoản', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.upgradeToPremium = upgradeToPremium;
