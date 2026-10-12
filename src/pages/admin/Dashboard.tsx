import { getDashboardStats, getOrders } from "@/data/orders";
import { formatLKR, formatDate } from "@/lib/format";

export function Dashboard() {
  const stats = getDashboardStats();
  const recentOrders = getOrders().slice(0, 6);
  const maxQty = Math.max(1, ...stats.topProducts.map((p) => p.qty));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue" value={formatLKR(stats.revenueCents)} />
        <StatCard label="Orders" value={String(stats.orderCount)} />
        <StatCard label="Avg. Order Value" value={formatLKR(stats.avgOrderValueCents)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-stone">No sales yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stats.topProducts.map((p) => (
                <li key={p.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-stone">{p.qty} sold</span>
                  </div>
                  <div className="h-2 bg-sand">
                    <div className="h-full bg-terracotta" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-stone">No orders yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex justify-between border-b border-stone/10 pb-2">
                  <span>{order.orderNumber} — {order.status.replace("_", " ")}</span>
                  <span className="text-stone">{formatDate(order.createdAt)} · {formatLKR(order.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-stone/15 p-5">
      <p className="text-xs uppercase tracking-wide text-stone">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
