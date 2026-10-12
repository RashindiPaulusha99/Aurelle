import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Button } from "@/components/ui/Button";
import { useWishlistIds } from "@/store/wishlistStore";
import { getProductById } from "@/data/products";
import type { Product } from "@/data/types";

export function Wishlist() {
  const wishlistIds = useWishlistIds();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const products = wishlistIds.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-2xl">Your wishlist is empty</h1>
        <p className="text-sm text-stone">Tap the heart on any product to save it here.</p>
        <Link to="/catalog">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl">Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
