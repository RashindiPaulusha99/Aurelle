import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/data/types";
import { getProductById } from "@/data/products";

interface CartState {
  lines: CartLine[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (productId, variantId, quantity = 1) => {
        const lines = get().lines;
        const existing = lines.find((l) => l.variantId === variantId);
        if (existing) {
          set({
            lines: lines.map((l) => (l.variantId === variantId ? { ...l, quantity: l.quantity + quantity } : l)),
          });
        } else {
          set({ lines: [...lines, { productId, variantId, quantity }] });
        }
      },
      removeItem: (variantId) => set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      setQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({ lines: get().lines.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)) });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "aurelle:cart" },
  ),
);

/** Resolves cart lines against current product/variant data for display + checkout totals. */
export function resolveCartLines(lines: CartLine[]) {
  return lines
    .map((line) => {
      const product = getProductById(line.productId);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant) return null;
      const image = product.images.find((img) => img.color === variant.color) ?? product.images[0];
      return { line, product, variant, image };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export function useCartCount(): number {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}
