import { Button } from "@/components/ui/Button";
import type { ProductFilters } from "@/data/products";

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  allColors: { name: string; hex: string }[];
  allSizes: string[];
  onClearAll: () => void;
}

const PRICE_BUCKETS = [
  { label: "Under LKR 5,000", min: 0, max: 500000 },
  { label: "LKR 5,000 – 7,500", min: 500000, max: 750000 },
  { label: "LKR 7,500 – 10,000", min: 750000, max: 1000000 },
  { label: "Over LKR 10,000", min: 1000000, max: Infinity },
];

export function FilterPanel({ filters, onChange, allColors, allSizes, onClearAll }: FilterPanelProps) {
  function toggleColor(name: string) {
    const current = filters.colors ?? [];
    const next = current.includes(name) ? current.filter((c) => c !== name) : [...current, name];
    onChange({ ...filters, colors: next.length ? next : undefined });
  }

  function toggleSize(size: string) {
    const current = filters.sizes ?? [];
    const next = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    onChange({ ...filters, sizes: next.length ? next : undefined });
  }

  function setPriceBucket(min: number, max: number) {
    const isActive = filters.minPriceCents === min && filters.maxPriceCents === (max === Infinity ? undefined : max);
    if (isActive) {
      onChange({ ...filters, minPriceCents: undefined, maxPriceCents: undefined });
    } else {
      onChange({ ...filters, minPriceCents: min, maxPriceCents: max === Infinity ? undefined : max });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Size</h4>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              aria-pressed={(filters.sizes ?? []).includes(size)}
              className={`focus-ring border px-3 py-1.5 text-xs ${
                (filters.sizes ?? []).includes(size) ? "border-ink bg-ink text-ivory" : "border-stone/30"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Color</h4>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleColor(c.name)}
              aria-pressed={(filters.colors ?? []).includes(c.name)}
              title={c.name}
              className={`h-8 w-8 rounded-full border-2 ${
                (filters.colors ?? []).includes(c.name) ? "border-terracotta" : "border-stone/20"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Price</h4>
        <div className="flex flex-col gap-2">
          {PRICE_BUCKETS.map((bucket) => (
            <label key={bucket.label} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.minPriceCents === bucket.min && filters.maxPriceCents === (bucket.max === Infinity ? undefined : bucket.max)}
                onChange={() => setPriceBucket(bucket.min, bucket.max)}
                className="accent-terracotta"
              />
              {bucket.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked || undefined })}
            className="accent-terracotta"
          />
          In stock only
        </label>
      </div>

      <Button variant="outline" onClick={onClearAll}>
        Clear all filters
      </Button>
    </div>
  );
}
