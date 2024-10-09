import { Request, Response } from 'express';
import * as PaymentService from '../services/paymentService';

export const createPaymentLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user ? req.user._id.toString() : null;
if (!userId) {
  return res.status(401).json({ message: 'User not authenticated' });
}

    const { amount } = req.body;
    console.log('User ID:', userId);
    console.log('Amount:', amount);
    const checkoutUrl = await PaymentService.createPaymentLink(userId, amount);
    res.status(200).json({ checkoutUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment link', error });
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  const { transactionId, status } = req.body;

  try {
    await PaymentService.handlePaymentWebhook(transactionId, status);
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing webhook', error });
  }
};
