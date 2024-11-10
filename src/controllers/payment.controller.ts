// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AuthRequest } from '../types/express';

export class PaymentController {
  static async createUpgradePayment(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Kiểm tra xem user đã là premium chưa
      if (req.user.role === 'member_premium') {
        return res.status(400).json({
          success: false,
          message: 'You are already a premium member'
        });
      }

      const result = await PaymentService.createUpgradePayment(req.user.id);

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
      const signature = req.headers['x-payos-signature'] as string;
      
      if (!signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing PayOS signature'
        });
      }

      // Log webhook data for debugging
      console.log('Received webhook:', {
        headers: req.headers,
        body: req.body
      });

      const result = await PaymentService.handleWebhook(req.body);

      // Always return 200 for webhooks
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      // Always return 200 for webhooks to prevent retries
      return res.status(200).json({
        success: false,
        message: error.message || 'Webhook processing failed'
      });
    }
  }

  static async getPaymentStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { orderCode } = req.params;

      if (!orderCode) {
        return res.status(400).json({
          success: false,
          message: 'Order code is required'
        });
      }

      const result = await PaymentService.getPaymentStatus(orderCode, req.user.id);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get payment status error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Get payment status failed'
      });
    }
  }
}