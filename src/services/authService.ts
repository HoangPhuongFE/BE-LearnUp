import bcrypt from 'bcrypt';
import User ,{IUser} from '../models/User';
import crypto from 'crypto';

// Tìm người dùng qua email
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// Tạo người dùng mới
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

// Kiểm tra đăng nhập
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  console.log('Stored password hash:', user.password);  // Log mật khẩu đã mã hóa trong DB
  console.log('Entered password:', password);  // Log mật khẩu đã nhập vào
  
  // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
  const isMatch = await bcrypt.compare( password , user.password);
  
  if (!isMatch) {
    console.log('Password does not match. Entered password:', password, 'Stored hash:', user.password);
    throw new Error('Invalid email or password');
  }

  return user;
};


// Tạo token đặt lại mật khẩu
export const createResetPasswordToken = async (user: any) => {
  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token hết hạn sau 10 phút

  await user.save();
  return resetToken;
};

// Đặt lại mật khẩu
export const resetUserPassword = async (user: any, newPassword: string) => {
  const salt = await bcrypt.genSalt(10);
  
  // Mã hóa mật khẩu mới
  user.password = await bcrypt.hash(newPassword, salt);
  console.log('New hashed password before saving:', user.password);  // Log mật khẩu đã mã hóa

  // Hủy token reset mật khẩu
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Lưu người dùng và log sau khi lưu
  await user.save()
    .then(() => console.log('Password has been saved to the database',user.password))
    .catch((err: unknown) => console.log('Error saving password to the database:', err));
};

// Cập nhật thông tin người dùng

export const updateUserService = async (userId: string, data: any): Promise<IUser | null> => {
  try {
    // Cập nhật thông tin người dùng bằng Mongoose
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
