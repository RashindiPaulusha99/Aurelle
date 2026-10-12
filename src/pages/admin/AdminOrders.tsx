import { useState } from "react";
import { Route, Routes, Link, useParams, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getOrders, getOrderById, updateOrderStatus } from "@/data/orders";
import { formatLKR, formatDate } from "@/lib/format";
import type { OrderStatus } from "@/data/types";

const STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

function OrdersList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const orders = getOrders();

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Orders</h1>
        <Select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-auto">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </Select>
      </div>

      <div className="overflow-x-auto border border-stone/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-stone/10">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 capitalize">{order.paymentMethod.replace("-", " ")}</td>
                <td className="px-4 py-3">{formatLKR(order.totalCents)}</td>
                <td className="px-4 py-3"><Badge tone="status">{order.status.replace("_", " ")}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/orders/${order.id}`} className="focus-ring underline">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="mt-4 text-sm text-stone">No orders match this filter.</p>}
    </div>
  );
}

function OrderManage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;
  const [, forceRerender] = useState(0);

  if (!order) return <Navigate to="/admin/orders" replace />;
  const resolvedOrderId = order.id;

  function setStatus(status: OrderStatus) {
    updateOrderStatus(resolvedOrderId, status, "Updated by admin");
    forceRerender((n) => n + 1);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">{order.orderNumber}</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}>Print Invoice</Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-stone">Status:</span>
        <Select aria-label="Update status" value={order.status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="w-auto">
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-lg">Items</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex justify-between border-b border-stone/10 pb-2">
                <span>{item.name} ({item.color}, {item.size}) × {item.quantity}</span>
                <span>{formatLKR(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-display text-lg">Shipping To</h2>
          <p className="text-sm">{order.shippingAddress.recipientName}</p>
          <p className="text-sm text-stone">{order.shippingAddress.phone}</p>
          <p className="text-sm text-stone">{order.shippingAddress.addressLine}</p>
          <p className="text-sm text-stone">{order.shippingAddress.city}, {order.shippingAddress.district}</p>
        </div>
      </div>

      <h2 className="mb-2 mt-6 font-display text-lg">Status History</h2>
      <ul className="flex flex-col gap-1 text-sm">
        {order.statusHistory.map((event, i) => (
          <li key={i} className="flex justify-between text-stone">
            <span>{event.status.replace("_", " ")}</span>
            <span>{formatDate(event.at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminOrders() {
  return (
    <Routes>
      <Route index element={<OrdersList />} />
      <Route path=":orderId" element={<OrderManage />} />
    </Routes>
  );
}
