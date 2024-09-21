import { Request, Response } from 'express';
import { createUser, loginUser, createResetPasswordToken, resetUserPassword, findUserByEmail } from '../services/authService';
import sendEmail from '../utils/sendEmail';
import generateToken from '../utils/generateToken';
import User from '../models/User'; 
import crypto from 'crypto';

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
    const user = await loginUser(email, password);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

// Quên mật khẩu
export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = await createResetPasswordToken(user);
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested the reset of a password.
     Please click the following link to reset your password: \n\n ${resetUrl}`;

    await sendEmail(user.email, 'Password reset', message);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};



export const resetPassword = async (req: Request, res: Response) => {
  const resetToken = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },  // Kiểm tra token còn hợp lệ
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log('User found for password reset:', user.email);

    // Đặt lại mật khẩu mới
    const newPassword = req.body.password;
    await resetUserPassword(user, newPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

