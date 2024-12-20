
import { Request, Response } from 'express';
import User from '../models/User';

// controllers/adminController.ts

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Không sử dụng keyword, lấy tất cả người dùng
    const users = await User.find().select('-password'); // Lấy tất cả người dùng

    res.status(200).json({
      message: 'Lấy danh sách người dùng thành công',
      users,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    } else {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: 'Unknown error' });
    }
  }
};




// Update user roles and permissions

export const updateUserRoleAndPermissions = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { role, permissions } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) {
      user.role = role;
    }

    if (permissions) {
      user.permissions = permissions;
    }

    await user.save();

    res.status(200).json({
      message: 'User role and permissions updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    // Fix starts here
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error updating user role and permissions', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

const updateUserRole = async (id: string, newRole: 'admin' | 'staff' | 'member_free' | 'member_premium', premiumStartDate?: Date, premiumEndDate?: Date) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');

  user.role = newRole;

  if (newRole === 'member_premium') {
    user.premiumStartDate = premiumStartDate;
    user.premiumEndDate = premiumEndDate;
  } else {
    user.premiumStartDate = undefined;
    user.premiumEndDate = undefined;
  }
  // Nếu người dùng được chuyển thành member_free thì xóa hết quyền
  if (newRole === 'member_free') {
    user.permissions = []; 
  }
  await user.save();
  return user;
};

export const changeUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    let premiumStartDate, premiumEndDate;

    if (role === 'member_premium') {
      premiumStartDate = new Date();
      premiumEndDate = new Date();
      premiumEndDate.setDate(premiumEndDate.getDate() + 30);
    }

    const user = await updateUserRole(id, role, premiumStartDate, premiumEndDate);

    res.status(200).json({
      message: `Cập nhật vai trò thành công, vai trò hiện tại là ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        premiumStartDate: user.premiumStartDate,
        premiumEndDate: user.premiumEndDate,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật vai trò', error: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};