// src/services/payment.service.ts
import PayOS from "@payos/node";
import { Payment } from "../models/payment.model";
import User from "../models/User";
import { ServiceResponse, PaymentData } from "../types/payment.type";
import { EmailService } from "../services/email.service";
import { PayosWebhookType } from '../types/payment.type';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export class PaymentService {
  private static payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID!,
    process.env.PAYOS_API_KEY!,
    process.env.PAYOS_CHECKSUM_KEY!
  );

  private static readonly PREMIUM_PRICE = 10000; // 10,000 VND

  static async createUpgradePayment(userId: string): Promise<ServiceResponse<PaymentData>> {
    try {
      // Check user exists and not premium
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.role === "member_premium") {
        throw new Error("User already has premium membership");
      }

      const orderCode = Date.now();
      const description = 'Premium';
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 days premium

      const paymentData = {
        orderCode,
        amount: this.PREMIUM_PRICE,
        description,
        cancelUrl: `${process.env.BE_URL}/payment/cancel`,
        returnUrl: `${process.env.BE_URL}/payment/success`,
        webhookUrl: `${process.env.PAYOS_WEBHOOK_URL}/api/payment/webhook`
      };

      // Create payment link via PayOS
      const paymentResponse = await this.payOS.createPaymentLink(paymentData);

      // Save to database
      await Payment.create({
        orderId: orderCode.toString(),
        userId,
        amount: this.PREMIUM_PRICE,
        type: 'UPGRADE_PREMIUM',
        status: 'PENDING',
        startDate,
        endDate,
        paymentLinkId: paymentResponse.paymentLinkId,
        paymentData: JSON.stringify(paymentResponse)
      });

      return {
        success: true,
        data: {
          checkoutUrl: paymentResponse.checkoutUrl,
          orderCode: orderCode.toString()
        }
      };

    } catch (error: any) {
      console.error("Create payment error:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async handleWebhook(webhookData: PayosWebhookType) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const isValidSignature = this.payOS.verifyPaymentWebhookData(webhookData);

      if (!isValidSignature) {
        throw new Error("Invalid webhook signature");
      }

      let orderInfo;
      try {
        orderInfo = JSON.parse(webhookData.data.description || "{}");
      } catch (error) {
        console.error("Error parsing description:", error);
        throw new Error("Invalid description format");
      }

      // Get user info for email
      const user = await User.findById(orderInfo.userId);
      if (!user) {
        throw new Error("User not found");
      }

      switch(webhookData.code) {
        case "00": { // Payment success
          try {
            // Update payment status
            const payment = await Payment.findOneAndUpdate(
              { orderId: webhookData.data.orderCode.toString() },
              {
                status: "SUCCESS",
                paymentMethod: webhookData.data.paymentMethod,
                bankCode: webhookData.data.bankCode,
                paymentTime: new Date(),
                paymentData: JSON.stringify(webhookData.data)
              },
              { session }
            );

            if (!payment) {
              throw new Error("Payment not found");
            }

            // Update user role
            await User.findByIdAndUpdate(
              orderInfo.userId,
              { 
                role: "member_premium",
                premiumStartDate: orderInfo.startDate,
                premiumEndDate: orderInfo.endDate
              },
              { session }
            );

            // Send success email
            if (user.email) {
              await EmailService.sendPaymentSuccessEmail(user.email, {
                orderCode: webhookData.data.orderCode.toString(),
                amount: payment.amount,
                paymentMethod: webhookData.data.paymentMethod,
                startDate: orderInfo.startDate,
                endDate: orderInfo.endDate,
                userName: user.name || 'Học viên'
              });
            }

            await session.commitTransaction();
            return { success: true, message: "Payment processed successfully" };
          } catch (error) {
            await session.abortTransaction();
            throw error;
          }
        }

        case "01": { // Payment cancelled
          try {
            await Payment.findOneAndUpdate(
              { orderId: webhookData.data.orderCode.toString() },
              {
                status: "CANCELLED",
                cancelTime: new Date(),
                cancelReason: webhookData.data.cancelReason || 'User cancelled',
                paymentData: JSON.stringify(webhookData.data)
              },
              { session }
            );

            // Send cancel email
            if (user.email) {
              await EmailService.sendPaymentFailedEmail(user.email, {
                orderCode: webhookData.data.orderCode.toString(),
                reason: webhookData.data.cancelReason || 'User cancelled',
                userName: user.name || 'Học viên',
                cancelTime: new Date()
              });
            }

            await session.commitTransaction();
            return { success: true, message: "Payment cancelled" };
          } catch (error) {
            await session.abortTransaction();
            throw error;
          }
        }

        case "02": { // Payment failed
          try {
            await Payment.findOneAndUpdate(
              { orderId: webhookData.data.orderCode.toString() },
              {
                status: "FAILED",
                paymentData: JSON.stringify(webhookData.data)
              },
              { session }
            );

            // Send failed email
            if (user.email) {
              await EmailService.sendPaymentFailedEmail(user.email, {
                orderCode: webhookData.data.orderCode.toString(),
                reason: 'Payment failed',
                userName: user.name || 'Học viên',
                cancelTime: new Date()
              });
            }

            await session.commitTransaction();
            return { success: true, message: "Payment failed" };
          } catch (error) {
            await session.abortTransaction();
            throw error;
          }
        }

        default: {
          await session.abortTransaction();
          return { success: false, message: "Unknown payment status" };
        }
      }

    } catch (error: any) {
      await session.abortTransaction();
      console.error("Handle webhook error:", error);
      return {
        success: false,
        message: error.message
      };
    } finally {
      session.endSession();
    }
  }

  // Check payment status
  static async getPaymentStatus(orderCode: string, userId: string) {
    try {
      const payment = await Payment.findOne({ orderId: orderCode, userId });
      if (!payment) {
        throw new Error("Payment not found");
      }

      return {
        success: true,
        data: {
          status: payment.status,
          paymentTime: payment.paymentTime,
          cancelTime: payment.cancelTime,
          cancelReason: payment.cancelReason
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}