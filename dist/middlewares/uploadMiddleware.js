"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
// Cấu hình Multer với giới hạn kích thước và số lượng file
const storage = multer_1.default.memoryStorage(); // Hoặc sử dụng diskStorage
exports.uploadFiles = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file là 5MB
    },
    fileFilter: (req, file, cb) => {
        // Chỉ cho phép tải lên file ảnh (JPEG, PNG, GIF)
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            req.fileValidationError = 'Chỉ cho phép tải lên file ảnh định dạng JPEG, PNG, GIF';
            return cb(null, false); // Trả về null vì không có lỗi, nhưng từ chối file
        }
        cb(null, true); // Chấp nhận file hợp lệ
    }
}).array('files', 3); // Tối đa 3 file
