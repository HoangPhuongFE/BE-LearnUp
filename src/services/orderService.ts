import Order from '../models/Order';
import User from '../models/User';
import { pricing } from '../config/pricing';

export const createOrderService = async (userId: string, product: keyof typeof pricing) => {
  const amount = pricing[product];
  if (!amount) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const order = new Order({
    user: userId,
    product,
    amount,
    status: 'pending',
  });

  await order.save();
  return order;
};

export const updateOrderStatusService = async (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (order && status === 'completed') {
    const user = await User.findById(order.user);
    if (user) {
      user.role = 'member_premium';
      user.premiumStartDate = new Date();
      user.premiumEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Thêm 30 ngày
      await user.save();
    }
  }

  return order;
};
