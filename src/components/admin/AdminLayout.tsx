import { NavLink, Outlet } from "react-router-dom";
import { useIsAdmin } from "@/store/authStore";
import { Navigate } from "react-router-dom";

const NAV = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/customers" },
  { label: "Coupons", to: "/admin/coupons" },
  { label: "Hero Slides", to: "/admin/hero-slides" },
];

export function AdminLayout() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-ivory text-ink">
      <aside className="w-56 shrink-0 border-r border-stone/15 bg-ink text-ivory">
        <div className="px-5 py-5 font-display text-xl">AURELLE Admin</div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `focus-ring rounded-[var(--radius-ui)] px-3 py-2 text-sm ${
                  isActive ? "bg-terracotta text-ivory" : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 px-3">
          <NavLink to="/" className="focus-ring text-xs text-ivory/50 hover:text-ivory">
            ← Back to storefront
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
