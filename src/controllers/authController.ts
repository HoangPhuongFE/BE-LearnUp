import { Request, Response } from 'express';
import { createUser, loginUser, createResetPasswordToken, resetUserPassword, findUserByEmail , updateUserService , getUserByIdService } from '../services/authService';
import sendEmail from '../utils/sendEmail';
import generateToken from '../utils/generateToken';
import User from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authMiddleware';

// Đăng ký người dùng
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser(name, email, password);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};


// Đăng nhập người dùng
export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng qua email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    // Trả về thông tin người dùng và token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: (error as Error).message });
  }
};


// Quên mật khẩu
export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const resetToken = await createResetPasswordToken(user);
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu.
Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn: \n\n ${resetUrl}`;

    await sendEmail(user.email, 'Password reset', message);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};





// Đặt lại mật khẩu người dùng
export const resetPassword = async (req: Request, res: Response) => {
  const resetToken = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  try {
    // Tìm người dùng theo token đặt lại mật khẩu
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },  // Token còn hạn
    });

    if (!user) {
      return res.status(400).json({ message: 'Mã thông báo không hợp lệ hoặc đã hết hạn' });
    }

    // Đặt lại mật khẩu mới
    const newPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();  // Lưu người dùng sau khi đặt lại mật khẩu

    res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu', error: (error as Error).message });
  }
};


// Cập nhật thông tin người dùng
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const updatedUser = await updateUserService(userId, data);

    res.status(200).json({ message: 'Người Dùng Cập Nhật Thành Congo ', user: updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      // Nếu error là instance của Error, truy cập vào message
      res.status(500).json({ message: 'Error updating user', error: error.message });
    } else {
      // Xử lý lỗi khác
      res.status(500).json({ message: 'Error updating user', error: 'Unknown error' });
    }
  }
};

// Lấy thông tin người dùng
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await getUserByIdService(userId);

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      // Nếu error là instance của Error, truy cập vào message
      res.status(500).json({ message: 'Error retrieving user', error: error.message });
    } else {
      // Xử lý lỗi khác
      res.status(500).json({ message: 'Error retrieving user', error: 'Unknown error' });
    }
  }
};
export const getUserInfo = async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};