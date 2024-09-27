import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'member_free' | 'member_premium';
  permissions?: string[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
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

  resetPasswordToken: String,
  resetPasswordExpire: Date,
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
