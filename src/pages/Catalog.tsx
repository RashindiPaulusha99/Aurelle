import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { FilterPanel } from "@/components/product/FilterPanel";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Input";
import { getProducts, getAllColors, getAllSizes, type ProductFilters } from "@/data/products";
import type { Product } from "@/data/types";

const PAGE_SIZE = 12;

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filters: ProductFilters = useMemo(
    () => ({
      category: params.get("category") ?? undefined,
      sub: params.get("sub") ?? undefined,
      tag: params.get("tag") ?? undefined,
      query: params.get("q") ?? undefined,
      colors: params.get("colors")?.split(",").filter(Boolean),
      sizes: params.get("sizes")?.split(",").filter(Boolean),
      minPriceCents: params.get("min") ? Number(params.get("min")) : undefined,
      maxPriceCents: params.get("max") ? Number(params.get("max")) : undefined,
      inStockOnly: params.get("inStock") === "1",
      sort: (params.get("sort") as ProductFilters["sort"]) ?? "newest",
    }),
    [params],
  );

  function updateFilters(next: ProductFilters) {
    const newParams = new URLSearchParams(params);
    const setOrDelete = (key: string, value: string | undefined) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    };
    setOrDelete("colors", next.colors?.join(","));
    setOrDelete("sizes", next.sizes?.join(","));
    setOrDelete("min", next.minPriceCents?.toString());
    setOrDelete("max", next.maxPriceCents?.toString());
    setOrDelete("inStock", next.inStockOnly ? "1" : undefined);
    setParams(newParams);
    setVisibleCount(PAGE_SIZE);
  }

  function clearAll() {
    const newParams = new URLSearchParams();
    const category = params.get("category");
    if (category) newParams.set("category", category);
    setParams(newParams);
    setVisibleCount(PAGE_SIZE);
  }

  const allProducts = getProducts(filters);
  const visibleProducts = allProducts.slice(0, visibleCount);
  const allColors = getAllColors();
  const allSizes = getAllSizes();

  const heading = filters.tag === "sale" ? "Sale" : filters.category ? titleCase(filters.category) : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-stone">{allProducts.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="focus-ring border border-stone/30 px-4 py-2 text-xs uppercase tracking-wide lg:hidden"
          >
            Filters
          </button>
          <Select
            aria-label="Sort by"
            value={filters.sort}
            onChange={(e) => {
              const newParams = new URLSearchParams(params);
              newParams.set("sort", e.target.value);
              setParams(newParams);
            }}
            className="w-auto"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} onChange={updateFilters} allColors={allColors} allSizes={allSizes} onClearAll={clearAll} />
        </aside>

        <div>
          {visibleProducts.length === 0 ? (
            <p className="py-20 text-center text-sm text-stone">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}

          {visibleCount < allProducts.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="focus-ring border border-ink px-8 py-3 text-xs uppercase tracking-wide hover:bg-ink hover:text-ivory"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} title="Filters" side="bottom">
        <FilterPanel filters={filters} onChange={updateFilters} allColors={allColors} allSizes={allSizes} onClearAll={clearAll} />
      </Drawer>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
