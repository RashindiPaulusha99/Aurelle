import { Link } from "react-router-dom";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Women", href: "/catalog?category=women" },
      { label: "Men", href: "/catalog?category=men" },
      { label: "Accessories", href: "/catalog?category=accessories" },
      { label: "Sale", href: "/catalog?tag=sale" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Find My Size", href: "/find-my-size" },
      { label: "Virtual Try-On", href: "/try-on" },
      { label: "Track an Order", href: "/account/orders" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About AURELLE", href: "/about" },
      { label: "Returns Policy", href: "/policies/returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-2xl">AURELLE</span>
            <p className="mt-3 max-w-xs text-sm text-ivory/60">
              Modern island essentials — editorial design, honest fabrics, made for Sri Lankan weather.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ivory/50">{col.heading}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="focus-ring text-sm text-ivory/80 hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ivory/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ivory/50">
            Payments: PayHere &middot; Visa &middot; Mastercard &middot; Cash on Delivery
          </p>
          <div className="flex gap-4 text-xs text-ivory/50">
            <span>&copy; {new Date().getFullYear()} AURELLE. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
