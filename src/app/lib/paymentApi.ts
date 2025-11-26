// src/app/lib/paymentApi.ts
import { apiRequest } from "./apiGateway";
import { OrderStatus } from "./orderApi";

export type PaymentMethod = "MOBILE_MONEY" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";

export interface PaymentData {
  orderId: number;
  amount: number;
  paymentMethod?: PaymentMethod;
  phoneNumber?: string;
  transactionId?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface PaymentResponse {
  status: OrderStatus;
  message: string;
  orderId?: number;
}

/**
 * Complete payment for an order
 * Backend endpoint: POST /api/v1/checkout/completePayment
 */
export async function completePayment(
  paymentData: PaymentData
): Promise<PaymentResponse> {
  const response = await apiRequest<{
    data: OrderStatus;
    status: number;
    message: string;
  }>("/checkout/completePayment", {
    method: "POST",
    data: paymentData,
    requiresAuth: true,
  });

  return {
    status: response.data,
    message: response.message || "Payment completed successfully",
  };
}

/**
 * Verify payment status
 * Note: This endpoint may not exist on backend yet
 */
export async function verifyPayment(
  transactionId: string
): Promise<{ verified: boolean; status: string }> {
  const response = await apiRequest<{
    data: { verified: boolean; status: string };
    status: number;
    message: string;
  }>(`/checkout/verifyPayment/${transactionId}`, {
    method: "GET",
    requiresAuth: true,
  });

  return response.data;
}
