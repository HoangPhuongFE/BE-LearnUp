import { Request, Response } from 'express';
import { createPaymentLink } from '../services/paymentService';
import { pricing } from '../config/pricing';

export const createPayment = async (req: Request, res: Response) => {
  const { product } = req.body as { product: keyof typeof pricing };
  const user = req.user;

  const amount = pricing[product];

  try {
    // Tạo mã orderCode ngẫu nhiên có độ dài dưới 6 chữ số
    const orderCode = Math.floor(Math.random() * 899999) + 1;

    const paymentLink = await createPaymentLink({
      orderCode: orderCode,  // Sử dụng orderCode dưới dạng số
      amount,
      description: `Thanh toán ${product}`,
      returnUrl: 'http://localhost:3030/payment/success',
      cancelUrl: 'http://localhost:3030/payment/cancel'
    });

    res.json({
      success: true,
      checkoutUrl: paymentLink.checkoutUrl,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Không thể tạo link thanh toán', error: errorMessage });
  }
};
