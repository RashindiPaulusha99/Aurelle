import { Navigate, useParams } from "react-router-dom";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { getOrderById } from "@/data/orders";
import { useCurrentCustomer } from "@/store/authStore";
import { formatLKR, formatDate } from "@/lib/format";

const STATUS_FLOW = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const customer = useCurrentCustomer();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order || !customer || order.customerId !== customer.id) return <Navigate to="/account/orders" replace />;

  const currentStepIndex = STATUS_FLOW.indexOf(order.status as typeof STATUS_FLOW[number]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">{order.orderNumber}</h1>
        <Badge tone="status">{order.status.replace("_", " ")}</Badge>
      </div>
      <p className="mb-6 text-sm text-stone">Placed on {formatDate(order.createdAt)}</p>

      {currentStepIndex >= 0 && (
        <div className="mb-8 flex items-center gap-1">
          {STATUS_FLOW.map((status, i) => (
            <div key={status} className="flex flex-1 items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${i <= currentStepIndex ? "bg-terracotta" : "bg-stone/25"}`} />
              {i < STATUS_FLOW.length - 1 && <div className={`h-px flex-1 ${i < currentStepIndex ? "bg-terracotta" : "bg-stone/25"}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-[1fr_280px]">
        <div>
          <h2 className="mb-3 font-display text-lg">Items</h2>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex gap-3 border border-stone/15 p-3">
                <PlaceholderImage seed={item.imageUrl} aspect="square" className="w-16" />
                <div className="flex-1 text-xs">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-stone">{item.color} · {item.size} · Qty {item.quantity}</p>
                </div>
                <span className="text-sm">{formatLKR(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <h2 className="mb-3 mt-8 font-display text-lg">Status History</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {order.statusHistory.map((event, i) => (
              <li key={i} className="flex justify-between border-b border-stone/10 pb-2">
                <span>{event.status.replace("_", " ")}{event.note ? ` — ${event.note}` : ""}</span>
                <span className="text-stone">{formatDate(event.at)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit border border-stone/15 p-5 text-sm">
          <h2 className="mb-3 font-display text-lg">Shipping Address</h2>
          <p>{order.shippingAddress.recipientName}</p>
          <p className="text-stone">{order.shippingAddress.phone}</p>
          <p className="text-stone">{order.shippingAddress.addressLine}</p>
          <p className="text-stone">{order.shippingAddress.city}, {order.shippingAddress.district}</p>

          <div className="mt-5 flex flex-col gap-1 border-t border-stone/15 pt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatLKR(order.subtotalCents)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatLKR(order.deliveryFeeCents)}</span></div>
            {order.discountCents > 0 && <div className="flex justify-between text-terracotta"><span>Discount</span><span>-{formatLKR(order.discountCents)}</span></div>}
            <div className="flex justify-between border-t border-stone/15 pt-2 font-medium"><span>Total</span><span>{formatLKR(order.totalCents)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
