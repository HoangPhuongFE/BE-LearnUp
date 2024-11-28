import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

// Định nghĩa lại interface của Request để có thể gán user vào request
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Bỏ qua xác thực cho yêu cầu OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Trả về 204 No Content
  }

  // Đưa ra một danh sách các route mở cho Guest mà không cần xác thực token
  const guestRoutes = [
    '/api/subjects',        // Cho phép guest xem danh sách môn học
    '/api/subjects/:id',    // Cho phép guest xem thông tin môn học theo id
    '/api/resources/all-resources', // Cho phép guest xem tất cả tài liệu
    '/api/resources/:subjectId/resources' // Cho phép guest xem tài liệu của một môn học cụ thể
  ];

  // Kiểm tra nếu route hiện tại là một trong những route cho phép Guest truy cập mà không cần token
  if (guestRoutes.some(route => new RegExp(`^${route.replace(/:id/, '\\w+').replace(/:subjectId/, '\\w+')}$`).test(req.originalUrl))) {
    return next(); // Cho phép truy cập mà không cần token (dành cho Guest)
  }

  // Kiểm tra xem token có được truyền trong header Authorization không
  let token: string | undefined;
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc không có token' });
  }

  token = req.headers.authorization.split(' ')[1]; // Tách token ra khỏi 'Bearer'

  try {
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    req.user = user; // Gán thông tin người dùng vào request
    next(); // Tiếp tục cho phép truy cập nếu có token hợp lệ
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

// Middleware xác thực token khác
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};
