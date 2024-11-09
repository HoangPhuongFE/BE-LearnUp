// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  static async createUpgradePayment(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const userId = req.user.id;
      const result = await PaymentService.createUpgradePayment(userId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Payment creation error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Payment creation failed'
      });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      const result = await PaymentService.handleWebhook(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      return res.status(200).json({
        success: false,
        message: error.message || 'Webhook processing failed'
      });
    }
  }
}