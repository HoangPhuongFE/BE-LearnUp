
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const checkPermission = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // Nếu là admin, bỏ qua kiểm tra quyền
    if (user?.role === 'admin') {
      return next();
    }

    // Kiểm tra quyền của người dùng
    if (user?.permissions && user.permissions.includes(requiredPermission)) {
      return next();
    } else {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
    }
  };
};
