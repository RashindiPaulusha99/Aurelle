import { db } from "./db";
import { adjustVariantStockForOrder } from "./products";
import { generateId, generateOrderNumber } from "@/lib/format";
import type { Order, OrderLineItem, PaymentMethod, OrderStatus } from "./types";

export interface CreateOrderInput {
  customerId?: string;
  guestEmail?: string;
  items: OrderLineItem[];
  subtotalCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  shippingAddress: Order["shippingAddress"];
  deliveryZone: Order["deliveryZone"];
}

function initialStatusForMethod(method: PaymentMethod): OrderStatus {
  // COD orders start in fulfilment immediately since no online payment is collected.
  // PayHere / bank transfer are treated as confirmed paid in this always-succeeds mock.
  return method === "cod" ? "PROCESSING" : "PAID";
}

/** Simulates the checkout submit → always succeeds per the frontend-only phase plan. */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const status = initialStatusForMethod(input.paymentMethod);
  const now = new Date().toISOString();

  const order: Order = {
    id: generateId("order"),
    orderNumber: generateOrderNumber(),
    customerId: input.customerId,
    guestEmail: input.guestEmail,
    items: input.items,
    subtotalCents: input.subtotalCents,
    deliveryFeeCents: input.deliveryFeeCents,
    discountCents: input.discountCents,
    totalCents: input.subtotalCents + input.deliveryFeeCents - input.discountCents,
    couponCode: input.couponCode,
    paymentMethod: input.paymentMethod,
    status,
    statusHistory: [{ status, at: now, note: "Order placed" }],
    shippingAddress: input.shippingAddress,
    deliveryZone: input.deliveryZone,
    createdAt: now,
  };

  const orders = db.getOrders();
  orders.unshift(order);
  db.saveOrders(orders);

  adjustVariantStockForOrder(input.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })));

  return order;
}

export function getOrders(): Order[] {
  return db.getOrders();
}

export function getOrderById(id: string): Order | undefined {
  return db.getOrders().find((o) => o.id === id);
}

export function getOrdersForCustomer(customerId: string): Order[] {
  return db
    .getOrders()
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): void {
  const orders = db.getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;
  order.status = status;
  order.statusHistory.push({ status, at: new Date().toISOString(), note });
  db.saveOrders(orders);
}

export function getDashboardStats() {
  const orders = db.getOrders();
  const revenueCents = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "PENDING_PAYMENT")
    .reduce((sum, o) => sum + o.totalCents, 0);
  const orderCount = orders.length;
  const avgOrderValueCents = orderCount ? Math.round(revenueCents / orderCount) : 0;

  const productCounts = new Map<string, { name: string; qty: number }>();
  orders.forEach((o) =>
    o.items.forEach((item) => {
      const existing = productCounts.get(item.productId);
      if (existing) existing.qty += item.quantity;
      else productCounts.set(item.productId, { name: item.name, qty: item.quantity });
    }),
  );
  const topProducts = Array.from(productCounts.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return { revenueCents, orderCount, avgOrderValueCents, topProducts };
}
