"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = exports.uploadFiles = void 0;
// src/middlewares/uploadMiddleware.ts
const multer_1 = __importDefault(require("multer"));
// Cấu hình storage
const storage = multer_1.default.memoryStorage();
// Cấu hình upload
exports.uploadFiles = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra mime type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            req.fileValidationError = 'Chỉ cho phép tải lên file ảnh định dạng JPEG, PNG, GIF';
            return cb(null, false);
        }
        cb(null, true);
    }
}).array('files', 3); // Cho phép tối đa 3 file
// Middleware xử lý upload
const handleFileUpload = (req, res, next) => {
    (0, exports.uploadFiles)(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // Xử lý lỗi từ multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File quá lớn. Kích thước tối đa là 5MB'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Số lượng file vượt quá giới hạn cho phép (tối đa 3 file)'
                });
            }
            return res.status(400).json({
                success: false,
                message: `Lỗi upload file: ${err.message}`
            });
        }
        if (err) {
            // Xử lý các lỗi khác
            return res.status(500).json({
                success: false,
                message: `Lỗi server: ${err.message}`
            });
        }
        if (req.fileValidationError) {
            return res.status(400).json({
                success: false,
                message: req.fileValidationError
            });
        }
        next();
    });
};
exports.handleFileUpload = handleFileUpload;
