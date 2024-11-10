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

// Mở rộng WebhookDataType
export interface ExtendedWebhookDataType extends PayosTypes.WebhookDataType {
  paymentMethod?: string;
  bankCode?: string;
  cancelReason?: string;
}
export interface PayosWebhookType extends PayosTypes.WebhookType {
  data: ExtendedWebhookDataType;
}


// Sử dụng WebhookType gốc
export type PayosCheckoutRequestType = PayosTypes.CheckoutRequestType;
