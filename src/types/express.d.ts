// src/types/express.d.ts
import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}
declare global {
    namespace Express {
      // Mở rộng interface Request
      interface Request {
        user?: IUser;
        fileValidationError?: string;
        files?: Express.Multer.File[];  // Thêm cho multiple files
        file?: Express.Multer.File;     // Thêm cho single file
      }
    }
  }
  
  export {};