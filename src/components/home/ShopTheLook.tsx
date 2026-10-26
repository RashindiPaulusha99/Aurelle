import { useState } from "react";
import { motion } from "framer-motion";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import type { Product } from "@/data/types";

interface Hotspot {
  id: string;
  xPct: number;
  yPct: number;
  product: Product;
}

export function ShopTheLook({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);

  const hotspots: Hotspot[] = products.slice(0, 3).map((product, i) => ({
    id: product.id,
    xPct: [51, 59, 54][i] ?? 50,
    yPct: [32, 55, 62][i] ?? 50,
    product,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="mb-6 font-display text-2xl sm:text-3xl">
        Shop the <span className="accent-italic text-terracotta">Look</span>
      </h2>
      <div className="relative">
        <PlaceholderImage seed="shop-the-look-model" label="Editorial look" aspect="wide" className="w-full" />
        {hotspots.map((h) => (
          <div
            key={h.id}
            className="absolute"
            style={{ left: `${h.xPct}%`, top: `${h.yPct}%`, zIndex: openHotspot === h.id ? 20 : 10 }}
          >
            <button
              aria-label={`Shop ${h.product.name}`}
              onClick={() => setOpenHotspot(openHotspot === h.id ? null : h.id)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-ivory bg-terracotta text-ivory shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            >
              <motion.span
                className="absolute -inset-1 rounded-full border border-ivory/80"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              +
            </button>
            {openHotspot === h.id && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveProduct(h.product)}
                className={`focus-ring absolute w-40 bg-ivory p-3 text-left text-xs shadow-lg ${
                  h.yPct > 50 ? "bottom-9" : "top-9"
                } ${h.xPct > 50 ? "right-0" : "left-0"}`}
              >
                <span className="block font-medium">{h.product.name}</span>
                <span className="text-stone">View product →</span>
              </motion.button>
            )}
          </div>
        ))}
      </div>
      <QuickViewModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}
