// services/authService.ts
import User, { IUser } from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const createUser = async (name: string, email: string, password: string) => {
  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const createResetPasswordToken = async (user: any) => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token hết hạn sau 10 phút
  await user.save();
  return resetToken;
};

export const resetUserPassword = async (user: any, newPassword: string) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

export const updateUserService = async (userId: string, data: any): Promise<IUser | null> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user');
  }
};

export const getUserByIdService = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error retrieving user');
  }
};