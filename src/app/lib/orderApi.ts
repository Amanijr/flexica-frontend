// src/app/lib/orderApi.ts
import { apiRequest } from "./apiGateway";

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "SHIPPED" | "DELIVERED";

export interface OrderItem {
  id: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  orderItems: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceOrderResponse {
  orderId: number;
  totalPrice: number;
  status: OrderStatus;
  message: string;
}

/**
 * Place an order from the current user's cart
 * Backend endpoint: POST /api/v1/order/placeOrder
 */
export async function placeOrder(): Promise<PlaceOrderResponse> {
  // Developer testing hook: if TEST_FORCE_INSUFFICIENT_STOCK set in localStorage, simulate server error
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('TEST_FORCE_INSUFFICIENT_STOCK') === '1') {
      throw new Error('Insufficient stock for product 123: available=0, demanded=2');
    }

    const response = await apiRequest<{
      data: {
        orderId: number;
        totalPrice: number;
        status: OrderStatus;
      };
      statusCode: number;
      message: string;
    }>("/order/placeOrder", {
      method: "POST",
      requiresAuth: true,
    });

    return {
      orderId: response.data.orderId,
      totalPrice: response.data.totalPrice,
      status: response.data.status,
      message: response.message || "Order placed successfully",
    };
  } catch (err: any) {
    // rethrow so callers can handle; preserve message
    throw err;
  }
}

/**
 * Fetch all orders for the current user
 * Backend endpoint: GET /api/v1/order/fetchMyOrder
 */
export async function fetchMyOrders(): Promise<Order[]> {
  const response = await apiRequest<{
    data: Order[];
    status: number;
    message: string;
  }>("/order/fetchMyOrder", {
    method: "GET",
    requiresAuth: true,
  });

  return response.data || [];
}

/**
 * Fetch a single order by ID
 * Note: This endpoint may not exist on backend yet
 */
export async function fetchOrderById(orderId: number): Promise<Order> {
  const response = await apiRequest<{
    data: Order;
    status: number;
    message: string;
  }>(`/order/fetchOrder/${orderId}`, {
    method: "GET",
    requiresAuth: true,
  });

  return response.data;
}
