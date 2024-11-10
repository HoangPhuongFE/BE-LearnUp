// src/middlewares/uploadMiddleware.ts
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

// Cấu hình storage
const storage = multer.memoryStorage();

// Type cho file filter function
import { FileFilterCallback } from 'multer';

// Cấu hình upload
export const uploadFiles = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
  ) => {
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
export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadFiles(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
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