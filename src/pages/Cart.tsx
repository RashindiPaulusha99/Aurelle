import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useCartStore, resolveCartLines } from "@/store/cartStore";
import { formatLKR } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD_CENTS } from "@/data/mock/locations";

export function Cart() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const resolved = resolveCartLines(lines);
  const subtotalCents = resolved.reduce((sum, r) => sum + r.product.priceCents * r.line.quantity, 0);
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents;

  if (resolved.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-2xl">Your bag is empty</h1>
        <p className="text-sm text-stone">Browse the new arrivals and find something you love.</p>
        <Link to="/catalog">
          <Button variant="primary">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-display text-3xl">Your Bag</h1>
      {remainingForFreeDelivery > 0 ? (
        <p className="mb-8 text-sm text-stone">
          Add {formatLKR(remainingForFreeDelivery)} more for free island-wide delivery.
        </p>
      ) : (
        <p className="mb-8 text-sm text-terracotta">You've unlocked free island-wide delivery!</p>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-stone/15">
          {resolved.map(({ line, product, variant, image }) => (
            <li key={variant.id} className="flex gap-4 py-5">
              <Link to={`/product/${product.slug}`} className="shrink-0">
                <PlaceholderImage seed={image.url} aspect="square" className="w-24" />
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <Link to={`/product/${product.slug}`} className="focus-ring text-sm font-medium">
                  {product.name}
                </Link>
                <p className="text-xs text-stone">
                  {variant.color} · {variant.size}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <QuantityStepper quantity={line.quantity} onChange={(q) => setQuantity(variant.id, q)} max={variant.stock} />
                  <span className="text-sm font-medium">{formatLKR(product.priceCents * line.quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(variant.id)} aria-label="Remove item" className="focus-ring self-start text-stone hover:text-terracotta">
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-stone/15 p-6">
          <h2 className="mb-4 font-display text-lg">Order Summary</h2>
          <div className="mb-6 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatLKR(subtotalCents)}</span>
          </div>
          <p className="mb-4 text-xs text-stone">Delivery and any coupon discount are calculated at checkout.</p>
          <Link to="/checkout">
            <Button variant="accent" fullWidth>
              Proceed to Checkout
            </Button>
          </Link>
          <Link to="/catalog" className="focus-ring mt-3 block text-center text-xs underline text-stone">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
