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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Kiểm tra xem token có được truyền trong header không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else {
        return res.status(401).json({ message: 'Không có token, không được phép truy cập' });
    }
    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Tìm người dùng dựa trên ID trong token
        const user = yield User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại' });
        }
        // Kiểm tra nếu tài khoản là premium và đã hết hạn
        if (user.role === 'member_premium' && user.premiumEndDate && user.premiumEndDate < new Date()) {
            // Nếu tài khoản premium đã hết hạn, hạ cấp người dùng về member_free
            user.role = 'member_free';
            user.premiumEndDate = undefined;
            user.premiumStartDate = undefined;
            yield user.save();
        }
        // Gán người dùng vào request để sử dụng ở các middleware hoặc controller sau
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
});
exports.protect = protect;