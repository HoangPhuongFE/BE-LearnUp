import { IUser } from '../../models/User'; // Import đúng đường dẫn của User model

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;  // Định nghĩa thuộc tính user với kiểu IUser
    }
  }
}
// custom.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    fileValidationError?: string; // Thêm thuộc tính tùy chỉnh
  }
}
