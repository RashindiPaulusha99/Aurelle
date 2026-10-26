import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_CATEGORIES } from "@/data/mock/categories";
import { useCartCount } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistIds } from "@/store/wishlistStore";
import { useCurrentCustomer } from "@/store/authStore";
import { MobileMenu } from "./MobileMenu";

function HeaderIcon({
  label,
  onClick,
  href,
  badge,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  children: React.ReactNode;
}) {
  const content = (
    <span className="relative inline-flex">
      {children}
      {badge != null && badge > 0 && (
        <motion.span
          key={badge}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-semibold text-ivory"
        >
          {badge > 9 ? "9+" : badge}
        </motion.span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link to={href} aria-label={label} className="focus-ring p-2 text-ink">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} aria-label={label} className="focus-ring p-2 text-ink">
      {content}
    </button>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const cartCount = useCartCount();
  const wishlistIds = useWishlistIds();
  const setMiniCartOpen = useUiStore((s) => s.setMiniCartOpen);
  const customer = useCurrentCustomer();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${solid ? "bg-ivory shadow-sm" : "bg-ivory/90"} backdrop-blur-sm`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              className="focus-ring p-2 text-ink lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <nav className="hidden items-center gap-7 lg:flex">
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.label} onMouseEnter={() => setActiveMenu(cat.label)}>
                  <Link
                    to={cat.href}
                    className="focus-ring text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:text-terracotta"
                  >
                    {cat.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <Link to="/" className="focus-ring flex items-center gap-2 justify-self-center">
            <img src="/images/logo-valestra.jpg" alt="VALESTRA" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
            <span className="font-display text-xl tracking-wide text-ink sm:text-2xl">VALESTRA</span>
          </Link>

          <div className="flex items-center justify-self-end gap-1">
            <HeaderIcon label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </HeaderIcon>
            <HeaderIcon label="Wishlist" href="/wishlist" badge={wishlistIds.length}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 20s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11c-2.5 4.65-9.5 9-9.5 9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </HeaderIcon>
            <HeaderIcon label="Account" href={customer ? "/account" : "/login"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </HeaderIcon>
            <HeaderIcon label="Cart" onClick={() => setMiniCartOpen(true)} badge={cartCount}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 8h12l-1 11.5a1 1 0 0 1-1 .5H8a1 1 0 0 1-1-.9L6 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </HeaderIcon>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu && NAV_CATEGORIES.find((c) => c.label === activeMenu)?.children.length ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="hidden border-t border-stone/15 bg-ivory lg:block"
            >
              <div className="mx-auto flex max-w-7xl gap-10 px-8 py-6">
                {NAV_CATEGORIES.find((c) => c.label === activeMenu)?.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="focus-ring text-sm text-ink hover:text-terracotta"
                    onClick={() => setActiveMenu(null)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="mx-auto mt-24 w-full max-w-xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={submitSearch} className="flex items-center gap-2 bg-ivory p-2 shadow-xl">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="focus-ring flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none"
                />
                <button type="submit" className="focus-ring bg-ink px-4 py-2 text-xs uppercase tracking-wide text-ivory">
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
