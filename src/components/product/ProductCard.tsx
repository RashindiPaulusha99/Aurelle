import { Link } from "react-router-dom";
import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { formatLKR } from "@/lib/format";
import { useWishlistIds, useToggleWishlist } from "@/store/wishlistStore";
import type { Product } from "@/data/types";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const wishlistIds = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const isWishlisted = wishlistIds.includes(product.id);

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? primaryImage;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden">
        <PlaceholderImage
          seed={hovered ? secondaryImage.url : primaryImage.url}
          label={product.name}
          aspect="portrait"
          className="w-full transition-opacity duration-300"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.tags.includes("new") && <Badge tone="new">New</Badge>}
          {product.tags.includes("sale") && <Badge tone="sale">Sale</Badge>}
          {totalStock === 0 && <Badge tone="low-stock">Sold Out</Badge>}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        className="focus-ring absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-ivory/90 text-ink transition-colors hover:text-terracotta"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "#b4532a" : "none"} aria-hidden="true">
          <path
            d="M12 20s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11c-2.5 4.65-9.5 9-9.5 9Z"
            stroke={isWishlisted ? "#b4532a" : "currentColor"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {onQuickView && (
        <button
          onClick={() => onQuickView(product)}
          className="focus-ring absolute bottom-0 left-0 right-0 translate-y-full bg-ink/90 py-2.5 text-xs uppercase tracking-wide text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick View
        </button>
      )}

      <div className="mt-3 flex flex-col gap-1">
        <Link to={`/product/${product.slug}`} className="focus-ring text-sm text-ink">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatLKR(product.priceCents)}</span>
          {product.compareAtCents && (
            <span className="text-xs text-stone line-through">{formatLKR(product.compareAtCents)}</span>
          )}
        </div>
        <div className="flex gap-1">
          {product.colors.slice(0, 5).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3 w-3 rounded-full border border-stone/30"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
