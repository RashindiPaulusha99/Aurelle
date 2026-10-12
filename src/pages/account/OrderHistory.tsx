import { Link } from "react-router-dom";
import { useCurrentCustomer } from "@/store/authStore";
import { getOrdersForCustomer } from "@/data/orders";
import { formatLKR, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function OrderHistory() {
  const customer = useCurrentCustomer();
  if (!customer) return null;
  const orders = getOrdersForCustomer(customer.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-stone">
          No orders yet. <Link to="/catalog" className="underline">Start shopping →</Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/account/orders/${order.id}`} className="flex items-center justify-between border border-stone/15 p-4 text-sm hover:bg-sand/40">
                <div>
                  <span className="font-medium">{order.orderNumber}</span>
                  <p className="text-stone">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="status">{order.status.replace("_", " ")}</Badge>
                  <span>{formatLKR(order.totalCents)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
