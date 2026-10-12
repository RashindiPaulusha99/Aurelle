import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Gallery } from "@/components/product/Gallery";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { getProductBySlug, getRelatedProducts, getProductById } from "@/data/products";
import { recommendSize } from "@/data/sizing";
import { formatLKR, formatDate } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { useWishlistIds, useToggleWishlist } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { useCurrentCustomer } from "@/store/authStore";
import { trackRecentlyViewed, getRecentlyViewed } from "@/lib/recentlyViewed";
import type { Product } from "@/data/types";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  const [color, setColor] = useState<string | undefined>(product?.colors[0]?.name);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const pushToast = useUiStore((s) => s.pushToast);
  const wishlistIds = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const customer = useCurrentCustomer();

  useEffect(() => {
    if (product) trackRecentlyViewed(product.id);
  }, [product]);

  useEffect(() => {
    setColor(product?.colors[0]?.name);
    setSize(undefined);
    setQuantity(1);
  }, [product?.id]);

  const recentlyViewedProducts = useMemo(() => {
    return getRecentlyViewed()
      .filter((id) => id !== product?.id)
      .map((id) => getProductById(id))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 4);
  }, [product?.id]);

  if (!product) return <Navigate to="/catalog" replace />;
  const currentProduct = product;

  const sizesForColor = Array.from(new Set(currentProduct.variants.filter((v) => v.color === color).map((v) => v.size)));
  const selectedVariant = currentProduct.variants.find((v) => v.color === color && v.size === size);
  const totalStockForColor = currentProduct.variants.filter((v) => v.color === color).reduce((sum, v) => sum + v.stock, 0);
  const isWishlisted = wishlistIds.includes(currentProduct.id);
  const relatedProducts = getRelatedProducts(currentProduct);

  const sizeRecommendation =
    customer?.sizeProfile && currentProduct.sizeChart.length ? recommendSize(customer.sizeProfile, currentProduct.sizeChart) : null;

  function handleAddToBag() {
    if (!selectedVariant) return;
    addItem(currentProduct.id, selectedVariant.id, quantity);
    pushToast(`Added ${currentProduct.name} (${color}, ${size}) to bag`, "success");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={product.images} activeColor={color} productName={product.name} />

        <div className="flex flex-col gap-5 lg:max-w-md">
          <div className="flex gap-2">
            {product.tags.includes("new") && <Badge tone="new">New</Badge>}
            {product.tags.includes("sale") && <Badge tone="sale">Sale</Badge>}
          </div>
          <h1 className="font-display text-3xl">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">{formatLKR(product.priceCents)}</span>
            {product.compareAtCents && <span className="text-sm text-stone line-through">{formatLKR(product.compareAtCents)}</span>}
          </div>
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)} />
              <span className="text-xs text-stone">{product.reviews.length} reviews</span>
            </div>
          )}
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
                  className={`h-9 w-9 rounded-full border-2 ${color === c.name ? "border-terracotta" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-stone">Size</p>
              {product.sizeChart.length > 0 && (
                <button onClick={() => setSizeGuideOpen(true)} className="focus-ring text-xs underline text-stone">
                  Size guide
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((s) => {
                const variant = product.variants.find((v) => v.color === color && v.size === s);
                const outOfStock = (variant?.stock ?? 0) === 0;
                const isRecommended = sizeRecommendation?.size === s;
                return (
                  <button
                    key={s}
                    disabled={outOfStock}
                    onClick={() => setSize(s)}
                    className={`focus-ring relative border px-4 py-2 text-sm ${
                      size === s ? "border-ink bg-ink text-ivory" : "border-stone/30"
                    } ${outOfStock ? "cursor-not-allowed text-stone/40 line-through" : ""}`}
                  >
                    {s}
                    {isRecommended && !outOfStock && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-terracotta" title="Recommended for you" />
                    )}
                  </button>
                );
              })}
            </div>
            {totalStockForColor > 0 && totalStockForColor <= 5 && (
              <p className="mt-2 text-xs text-terracotta">Only {totalStockForColor} left in this color</p>
            )}
          </div>

          {sizeRecommendation ? (
            <div className="border border-terracotta/40 bg-sand/60 p-3 text-xs text-ink">
              Based on your size profile, we recommend <strong>{sizeRecommendation.size}</strong>
              {sizeRecommendation.confidence !== "high" && " (estimate)"}.{" "}
              <Link to="/find-my-size" className="underline">
                Update profile
              </Link>
            </div>
          ) : (
            <Link to="/find-my-size" className="focus-ring flex items-center gap-2 text-xs text-ink underline">
              Not sure of your size? Take the Find My Size quiz →
            </Link>
          )}

          <div className="flex items-center gap-3">
            <QuantityStepper quantity={quantity} onChange={setQuantity} max={selectedVariant?.stock ?? 1} />
            <Button variant="accent" fullWidth disabled={!selectedVariant} onClick={handleAddToBag}>
              {selectedVariant ? "Add to Bag" : "Select a size"}
            </Button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="focus-ring flex-1 border border-stone/30 py-2.5 text-xs uppercase tracking-wide hover:bg-sand"
            >
              {isWishlisted ? "♥ Saved" : "♡ Save to Wishlist"}
            </button>
            {product.tryOnReady && (
              <Link to="/try-on" className="focus-ring flex-1">
                <button className="w-full border border-stone/30 py-2.5 text-xs uppercase tracking-wide hover:bg-sand">
                  Try it on
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 font-display text-xl">Reviews</h2>
          <div className="flex flex-col gap-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-stone/15 pb-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{review.author}</span>
                  <span className="text-xs text-stone">{formatDate(review.date)}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm font-medium">{review.title}</p>
                <p className="mt-1 text-sm text-stone">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl">
          <h2 className="mb-6 font-display text-xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewedProducts.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl">
          <h2 className="mb-6 font-display text-xl">Recently Viewed</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} chart={product.sizeChart} />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
