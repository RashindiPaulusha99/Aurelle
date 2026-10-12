import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { NAV_CATEGORIES } from "@/data/mock/categories";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="right">
      <nav className="flex flex-col gap-1">
        {NAV_CATEGORIES.map((cat) => (
          <div key={cat.label} className="border-b border-stone/15 py-3">
            <Link to={cat.href} onClick={onClose} className="focus-ring block text-sm font-semibold uppercase tracking-wide">
              {cat.label}
            </Link>
            {cat.children.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 pl-2">
                {cat.children.map((child) => (
                  <Link key={child.label} to={child.href} onClick={onClose} className="focus-ring text-sm text-stone">
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link to="/find-my-size" onClick={onClose} className="focus-ring py-3 text-sm text-terracotta">
          Find My Size
        </Link>
        <Link to="/try-on" onClick={onClose} className="focus-ring py-3 text-sm text-terracotta">
          Virtual Try-On
        </Link>
      </nav>
    </Drawer>
  );
}
