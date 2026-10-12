import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getOrderById } from "@/data/orders";
import { formatLKR, formatDate } from "@/lib/format";

const PAYMENT_LABELS: Record<string, string> = {
  payhere: "PayHere",
  cod: "Cash on Delivery",
  "bank-transfer": "Bank Transfer",
};

export function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="text-4xl">✓</span>
        <h1 className="mt-3 font-display text-3xl">Thank you, your order is confirmed</h1>
        <p className="mt-2 text-sm text-stone">
          Order <strong>{order.orderNumber}</strong> placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="border border-stone/15 p-6">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span>Payment Method</span>
          <span className="font-medium">{PAYMENT_LABELS[order.paymentMethod]}</span>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span>Status</span>
          <span className="font-medium">{order.status.replace("_", " ")}</span>
        </div>
        <ul className="mb-4 flex flex-col gap-3 border-t border-stone/15 pt-4">
          {order.items.map((item) => (
            <li key={item.variantId} className="flex gap-3">
              <PlaceholderImage seed={item.imageUrl} aspect="square" className="w-14" />
              <div className="flex-1 text-xs">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-stone">{item.color} · {item.size} · Qty {item.quantity}</p>
              </div>
              <span className="text-sm">{formatLKR(item.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1 border-t border-stone/15 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatLKR(order.subtotalCents)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{formatLKR(order.deliveryFeeCents)}</span></div>
          {order.discountCents > 0 && <div className="flex justify-between text-terracotta"><span>Discount</span><span>-{formatLKR(order.discountCents)}</span></div>}
          <div className="flex justify-between border-t border-stone/15 pt-2 font-medium"><span>Total</span><span>{formatLKR(order.totalCents)}</span></div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/catalog" className="flex-1">
          <Button variant="outline" fullWidth>Continue Shopping</Button>
        </Link>
        <Link to="/account/orders" className="flex-1">
          <Button variant="primary" fullWidth>View Order History</Button>
        </Link>
      </div>
    </div>
  );
}
