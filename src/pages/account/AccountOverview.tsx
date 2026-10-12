import { Link } from "react-router-dom";
import { useCurrentCustomer } from "@/store/authStore";
import { getOrdersForCustomer } from "@/data/orders";
import { formatLKR, formatDate } from "@/lib/format";

export function AccountOverview() {
  const customer = useCurrentCustomer();
  if (!customer) return null;

  const orders = getOrdersForCustomer(customer.id);
  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Welcome back, {customer.name.split(" ")[0]}</h1>

      {customer.sizeProfile ? (
        <div className="mb-6 border border-stone/15 p-4 text-sm">
          <strong className="block">Size Profile</strong>
          <span className="text-stone">
            {customer.sizeProfile.heightCm}cm · {customer.sizeProfile.weightKg}kg · {customer.sizeProfile.fitPreference} fit
          </span>{" "}
          <Link to="/find-my-size" className="ml-2 underline">Update</Link>
        </div>
      ) : (
        <div className="mb-6 border border-dashed border-stone/30 p-4 text-sm text-stone">
          You haven't taken the size quiz yet. <Link to="/find-my-size" className="underline text-ink">Find My Size →</Link>
        </div>
      )}

      <h2 className="mb-3 font-display text-lg">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-sm text-stone">No orders yet. <Link to="/catalog" className="underline">Start shopping →</Link></p>
      ) : (
        <ul className="flex flex-col gap-3">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between border border-stone/15 p-4 text-sm">
              <div>
                <Link to={`/account/orders/${order.id}`} className="font-medium underline">{order.orderNumber}</Link>
                <p className="text-stone">{formatDate(order.createdAt)} · {order.status.replace("_", " ")}</p>
              </div>
              <span>{formatLKR(order.totalCents)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
