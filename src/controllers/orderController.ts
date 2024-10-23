import { Request, Response } from 'express';
import { createOrderService, updateOrderStatusService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  const { product } = req.body;
  const user = req.user;

  try {
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const order = await createOrderService(user._id.toString(), product);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Không thể tạo đơn hàng', error: (error as Error).message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  try {
    const order = await updateOrderStatusService(orderId, status);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Không thể cập nhật trạng thái đơn hàng', error: (error as Error).message });
  }
};
