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
exports.getUserInfo = exports.getUserById = exports.updateUser = exports.resetPassword = exports.forgetPassword = exports.loginUserController = exports.registerUser = void 0;
const authService_1 = require("../services/authService");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Đăng ký người dùng
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const user = yield (0, authService_1.createUser)(name, email, password);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
// Đăng nhập người dùng
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Tìm người dùng qua email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email không tồn tại' });
        }
        // Kiểm tra mật khẩu
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
        // Tạo token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Trả về thông tin người dùng và token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
    }
});
exports.loginUserController = loginUserController;
// Quên mật khẩu
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield (0, authService_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const resetToken = yield (0, authService_1.createResetPasswordToken)(user);
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        const message = `Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu.
Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn: \n\n ${resetUrl}`;
        yield (0, sendEmail_1.default)(user.email, 'Password reset', message);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.forgetPassword = forgetPassword;
// Đặt lại mật khẩu người dùng
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = req.params.token;
    const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    try {
        // Tìm người dùng theo token đặt lại mật khẩu
        const user = yield User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }, // Token còn hạn
        });
        if (!user) {
            return res.status(400).json({ message: 'Mã thông báo không hợp lệ hoặc đã hết hạn' });
        }
        // Đặt lại mật khẩu mới
        const newPassword = req.body.password;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save(); // Lưu người dùng sau khi đặt lại mật khẩu
        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu', error: error.message });
    }
});
exports.resetPassword = resetPassword;
// Cập nhật thông tin người dùng
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const data = req.body;
        const updatedUser = yield (0, authService_1.updateUserService)(userId, data);
        res.status(200).json({ message: 'Người Dùng Cập Nhật Thành Congo ', user: updatedUser });
    }
    catch (error) {
        if (error instanceof Error) {
            // Nếu error là instance của Error, truy cập vào message
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
        else {
            // Xử lý lỗi khác
            res.status(500).json({ message: 'Error updating user', error: 'Unknown error' });
        }
    }
});
exports.updateUser = updateUser;
// Lấy thông tin người dùng
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield (0, authService_1.getUserByIdService)(userId);
        res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof Error) {
            // Nếu error là instance của Error, truy cập vào message
            res.status(500).json({ message: 'Error retrieving user', error: error.message });
        }
        else {
            // Xử lý lỗi khác
            res.status(500).json({ message: 'Error retrieving user', error: 'Unknown error' });
        }
    }
});
exports.getUserById = getUserById;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy user' });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            address: user.address,
            phone: user.phone,
            avatar: user.avatar,
            gender: user.gender,
            birthDate: user.birthDate,
            about: user.about,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserInfo = getUserInfo;
