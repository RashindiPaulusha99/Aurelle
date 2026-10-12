import { getAllCustomers } from "@/data/customers";
import { getOrdersForCustomer } from "@/data/orders";
import { formatDate } from "@/lib/format";

export function AdminCustomers() {
  const customers = getAllCustomers().filter((c) => c.role === "customer");

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Customers</h1>
      <div className="overflow-x-auto border border-stone/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-stone/10">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{getOrdersForCustomer(c.id).length}</td>
                <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
