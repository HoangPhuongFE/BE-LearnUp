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
exports.verifyToken = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Middleware để bảo vệ route
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Bỏ qua xác thực cho yêu cầu OPTIONS (preflight CORS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Trả về 204 No Content
    }
    // Danh sách các route mở cho Guest mà không cần xác thực token
    const guestRoutes = [
        '/api/subjects', // Cho phép guest xem danh sách môn học
        '/api/subjects/:id', // Cho phép guest xem thông tin môn học theo id
        '/api/resources/all-resources', // Cho phép guest xem tất cả tài liệu
        '/api/resources/:subjectId/resources' // Cho phép guest xem tài liệu của một môn học cụ thể
    ];
    // Kiểm tra nếu route hiện tại là một trong những route cho phép Guest truy cập mà không cần token
    if (guestRoutes.some(route => new RegExp(`^${route.replace(/:id/, '\\w+').replace(/:subjectId/, '\\w+')}$`).test(req.originalUrl))) {
        return next(); // Cho phép truy cập mà không cần token (dành cho Guest)
    }
    // Kiểm tra xem token có được truyền trong header Authorization không
    let token;
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc không có token' });
    }
    // Tách token ra khỏi 'Bearer'
    token = req.headers.authorization.split(' ')[1];
    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Tìm người dùng trong cơ sở dữ liệu
        const user = yield User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại' });
        }
        req.user = user; // Gán thông tin người dùng vào request
        next(); // Tiếp tục cho phép truy cập nếu có token hợp lệ
    }
    catch (error) {
        console.error('Token validation failed:', error);
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
});
exports.protect = protect;
// Middleware xác thực token khác
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
});
exports.verifyToken = verifyToken;
