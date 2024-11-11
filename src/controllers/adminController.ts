
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

export const upgradeToPremium = async (req: Request, res: Response) => {
  const { id } = req.params; // ID của người dùng

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    // Cập nhật role thành member_premium
    user.role = 'member_premium';

    // Lưu ngày bắt đầu và tính toán ngày hết hạn là 30 ngày kể từ ngày nâng cấp
    const premiumStartDate = new Date();
    const premiumEndDate = new Date();
    premiumEndDate.setDate(premiumEndDate.getDate() + 30);

    user.premiumStartDate = premiumStartDate;
    user.premiumEndDate = premiumEndDate;

    await user.save();

    res.status(200).json({
      message: 'Nâng cấp tài khoản thành công, tài khoản sẽ hết hạn sau 30 ngày',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        premiumStartDate: user.premiumStartDate, // Gửi thông tin ngày bắt đầu
        premiumEndDate: user.premiumEndDate, // Gửi thông tin ngày hết hạn về cho admin
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Lỗi khi nâng cấp tài khoản', error: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};
