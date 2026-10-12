import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuthStore, useCurrentCustomer } from "@/store/authStore";

const NAV = [
  { label: "Overview", to: "/account" },
  { label: "Order History", to: "/account/orders" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Profile", to: "/account/profile" },
];

export function AccountLayout() {
  const customer = useCurrentCustomer();
  const logout = useAuthStore((s) => s.logout);

  if (!customer) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="mb-4 text-sm text-stone">Signed in as</p>
          <p className="mb-6 font-medium">{customer.name}</p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/account"}
                className={({ isActive }) =>
                  `focus-ring rounded-[var(--radius-ui)] px-3 py-2 text-sm ${isActive ? "bg-sand" : "text-stone hover:bg-sand/50"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button onClick={logout} className="focus-ring mt-3 rounded-[var(--radius-ui)] px-3 py-2 text-left text-sm text-terracotta hover:bg-sand/50">
              Log Out
            </button>
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
