// src/types/payment.type.ts
import * as PayosTypes from '@payos/node/lib/type';

export interface PaymentData {
  checkoutUrl: string;
  orderCode: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Re-export PayOS types
export type PayosWebhookType = PayosTypes.WebhookType;
export type PayosWebhookDataType = PayosTypes.WebhookDataType;
export type PayosCheckoutRequestType = PayosTypes.CheckoutRequestType;