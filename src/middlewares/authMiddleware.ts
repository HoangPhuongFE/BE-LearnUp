import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

// Định nghĩa lại request để có thể gán user vào
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Kiểm tra xem token có được truyền trong header không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Không có token, không được phép truy cập' });
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Tìm người dùng dựa trên ID trong token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra nếu tài khoản là premium và đã hết hạn
    if (user.role === 'member_premium' && user.premiumEndDate && user.premiumEndDate < new Date()) {
      // Nếu tài khoản premium đã hết hạn, hạ cấp người dùng về member_free
      user.role = 'member_free';
      user.premiumEndDate = undefined;
      user.premiumStartDate = undefined;
      await user.save();
    }
    
    // Gán người dùng vào request để sử dụng ở các middleware hoặc controller sau
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
