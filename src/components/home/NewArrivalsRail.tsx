import { useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import type { Product } from "@/data/types";

export function NewArrivalsRail({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(delta: number) {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl sm:text-3xl">
          New <span className="accent-italic text-terracotta">Arrivals</span>
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scrollBy(-320)} aria-label="Scroll left" className="focus-ring border border-stone/30 p-2">
            ←
          </button>
          <button onClick={() => scrollBy(320)} aria-label="Scroll right" className="focus-ring border border-stone/30 p-2">
            →
          </button>
        </div>
      </div>
      <div ref={scrollerRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {products.map((product) => (
          <div key={product.id} className="w-[200px] shrink-0 sm:w-[260px]">
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </div>
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
