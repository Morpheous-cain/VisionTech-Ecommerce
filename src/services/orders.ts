/**
 * Order service — client-side API calls for order management.
 */
import type { Order } from "@/lib/types";

const BASE = "/api";

export interface CreateOrderPayload {
  delivery_address: string;
  delivery_option: "Pickup" | "Delivery";
  payment_method: "M-Pesa" | "Card";
  promo_code?: string;
  notes?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order");
  const { data } = await res.json();
  return data;
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE}/orders`);
  if (!res.ok) return [];
  const { data } = await res.json();
  return data;
}

export async function getOrder(id: string): Promise<Order | null> {
  const res = await fetch(`${BASE}/orders/${id}`);
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export async function initiateMpesaPayment(orderId: string, phone: string) {
  const res = await fetch(`${BASE}/payments/mpesa`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order_id: orderId, phone }),
  });
  if (!res.ok) throw new Error("Failed to initiate M-Pesa payment");
  return res.json();
}
