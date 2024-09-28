import { IUser } from '../../models/User'; // Import đúng đường dẫn của User model

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;  // Định nghĩa thuộc tính user với kiểu IUser
    }
  }
}
