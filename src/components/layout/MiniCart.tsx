import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useCartStore, resolveCartLines } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { formatLKR } from "@/lib/format";

export function MiniCart() {
  const open = useUiStore((s) => s.miniCartOpen);
  const setOpen = useUiStore((s) => s.setMiniCartOpen);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const resolved = resolveCartLines(lines);
  const subtotalCents = resolved.reduce((sum, r) => sum + r.product.priceCents * r.line.quantity, 0);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title={`Your Bag (${resolved.length})`}>
      {resolved.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-stone">Your bag is empty.</p>
          <Link to="/catalog" onClick={() => setOpen(false)}>
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-stone/15">
            {resolved.map(({ line, product, variant, image }) => (
              <li key={variant.id} className="flex gap-3 py-4">
                <Link to={`/product/${product.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                  <PlaceholderImage seed={image.url} aspect="square" className="w-20" />
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <Link to={`/product/${product.slug}`} onClick={() => setOpen(false)} className="focus-ring text-sm font-medium">
                    {product.name}
                  </Link>
                  <p className="text-xs text-stone">
                    {variant.color} · {variant.size}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <QuantityStepper quantity={line.quantity} onChange={(q) => setQuantity(variant.id, q)} max={variant.stock} />
                    <span className="text-sm font-medium">{formatLKR(product.priceCents * line.quantity)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(variant.id)}
                  aria-label="Remove item"
                  className="focus-ring self-start text-stone hover:text-terracotta"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-stone/15 pt-4">
            <div className="mb-4 flex items-center justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>{formatLKR(subtotalCents)}</span>
            </div>
            <Link to="/cart" onClick={() => setOpen(false)}>
              <Button variant="primary" fullWidth>
                View Bag
              </Button>
            </Link>
            <Link to="/checkout" onClick={() => setOpen(false)}>
              <Button variant="accent" fullWidth className="mt-2">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
