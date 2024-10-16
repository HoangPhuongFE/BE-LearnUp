import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'member_free' | 'member_premium';
  permissions?: string[];
  address?: string;
  phone?: string;
  avatar?: string;
  gender?: 'nam' | 'nu' | 'khac';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  premiumStartDate?: Date;  
  premiumEndDate?: Date;    
  matchPassword(enteredPassword: string): Promise<boolean>;
  _id: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'member_free', 'member_premium'],
    default: 'member_free',
  },
  permissions: {
    type: [String],
    default: [],
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['nam', 'nu', 'khac'],
    
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  premiumStartDate: {
    type: Date,
    default: null,
  },
  premiumEndDate: {
    type: Date,
    default: null,
  },
});

// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;