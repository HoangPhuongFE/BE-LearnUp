import multer from 'multer';

// Cấu hình Multer với giới hạn kích thước và số lượng file
const storage = multer.memoryStorage(); // Hoặc sử dụng diskStorage
export const uploadFiles = multer({
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
