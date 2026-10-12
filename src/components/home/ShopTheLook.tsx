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
    xPct: [28, 62, 45][i] ?? 50,
    yPct: [35, 55, 78][i] ?? 50,
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
          <div key={h.id} className="absolute" style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}>
            <button
              aria-label={`Shop ${h.product.name}`}
              onClick={() => setOpenHotspot(openHotspot === h.id ? null : h.id)}
              className="relative flex h-7 w-7 items-center justify-center rounded-full bg-terracotta text-ivory shadow-lg"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-terracotta/60"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              +
            </button>
            {openHotspot === h.id && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveProduct(h.product)}
                className="focus-ring absolute left-1/2 top-9 w-40 -translate-x-1/2 bg-ivory p-3 text-left text-xs shadow-lg"
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
