import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatLKR } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import type { Product } from "@/data/types";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [color, setColor] = useState<string | undefined>(product?.colors[0]?.name);
  const [size, setSize] = useState<string | undefined>(undefined);
  const addItem = useCartStore((s) => s.addItem);
  const pushToast = useUiStore((s) => s.pushToast);

  useEffect(() => {
    setColor(product?.colors[0]?.name);
    setSize(undefined);
  }, [product]);

  if (!product) return null;

  const sizesForColor = Array.from(new Set(product.variants.filter((v) => v.color === color).map((v) => v.size)));
  const image = product.images.find((img) => img.color === color) ?? product.images[0];

  function handleAdd() {
    if (!size || !color) return;
    const variant = product!.variants.find((v) => v.color === color && v.size === size);
    if (!variant) return;
    addItem(product!.id, variant.id, 1);
    pushToast(`Added ${product!.name} (${color}, ${size}) to bag`, "success");
    onClose();
  }

  return (
    <Modal open={Boolean(product)} onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <PlaceholderImage seed={image.url} label={product.name} aspect="portrait" />
        <div className="flex flex-col gap-4 pr-6">
          <h3 className="font-display text-2xl">{product.name}</h3>
          <span className="text-lg">{formatLKR(product.priceCents)}</span>
          <p className="text-sm text-stone">{product.description}</p>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone">Color: {color}</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  onClick={() => {
                    setColor(c.name);
                    setSize(undefined);
                  }}
                  className={`h-8 w-8 rounded-full border-2 ${color === c.name ? "border-terracotta" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((s) => {
                const variant = product.variants.find((v) => v.color === color && v.size === s);
                const outOfStock = (variant?.stock ?? 0) === 0;
                return (
                  <button
                    key={s}
                    disabled={outOfStock}
                    onClick={() => setSize(s)}
                    className={`focus-ring border px-3 py-1.5 text-xs ${
                      size === s ? "border-ink bg-ink text-ivory" : "border-stone/30"
                    } ${outOfStock ? "cursor-not-allowed text-stone/40 line-through" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <Button variant="accent" disabled={!size} onClick={handleAdd}>
            {size ? "Add to Bag" : "Select a size"}
          </Button>
          <Link to={`/product/${product.slug}`} onClick={onClose} className="focus-ring text-center text-xs underline text-stone">
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
