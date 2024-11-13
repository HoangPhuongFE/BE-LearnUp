
import express from 'express';
import {getUsers,
  updateUserRoleAndPermissions,
  deleteUser,
  changeUserRole,
} from '../controllers/adminController';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';

const router = express.Router();

// Lấy danh sách người dùng
router.get('/users', protect, checkPermission('manage_users'), getUsers);

// Cập nhật vai trò và quyền của người dùng
router.put('/user/:id', protect, checkPermission('manage_users'), updateUserRoleAndPermissions);

// Xóa người dùng
router.delete('/user/:id', protect, checkPermission('manage_users'), deleteUser);

// Nâng cấp tài khoản từ free lên premium
router.put('/user/:id/role', protect, checkPermission('manage_users'), changeUserRole);

export default router;
