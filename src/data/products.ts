import { db } from "./db";
import type { Product } from "./types";

export interface ProductFilters {
  category?: string;
  sub?: string;
  tag?: string;
  colors?: string[];
  sizes?: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  query?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
}

function matches(product: Product, filters: ProductFilters): boolean {
  if (filters.category && product.category !== filters.category) return false;
  if (filters.sub && product.subcategory !== filters.sub) return false;
  if (filters.tag && !product.tags.includes(filters.tag)) return false;
  if (filters.colors?.length && !product.colors.some((c) => filters.colors!.includes(c.name))) return false;
  if (filters.sizes?.length && !product.variants.some((v) => filters.sizes!.includes(v.size) && v.stock > 0)) {
    return false;
  }
  if (filters.minPriceCents != null && product.priceCents < filters.minPriceCents) return false;
  if (filters.maxPriceCents != null && product.priceCents > filters.maxPriceCents) return false;
  if (filters.inStockOnly && !product.variants.some((v) => v.stock > 0)) return false;
  if (filters.query) {
    const q = filters.query.toLowerCase();
    if (!product.name.toLowerCase().includes(q) && !product.description.toLowerCase().includes(q)) return false;
  }
  return true;
}

function sortProducts(products: Product[], sort: ProductFilters["sort"]): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function getProducts(filters: ProductFilters = {}): Product[] {
  const all = db.getProducts();
  const filtered = all.filter((p) => matches(p, filters));
  return sortProducts(filtered, filters.sort ?? "newest");
}

export function getProductBySlug(slug: string): Product | undefined {
  return db.getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return db.getProducts().find((p) => p.id === id);
}

export function getNewArrivals(limit = 8): Product[] {
  return sortProducts(db.getProducts(), "newest").slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return db.getProducts().filter((p) => p.tags.includes("best-seller")).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return db
    .getProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getAllColors(): { name: string; hex: string }[] {
  const map = new Map<string, string>();
  db.getProducts().forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
  return Array.from(map, ([name, hex]) => ({ name, hex }));
}

export function getAllSizes(): string[] {
  const set = new Set<string>();
  db.getProducts().forEach((p) => p.variants.forEach((v) => set.add(v.size)));
  // Keep a sensible garment-size order; anything unrecognised falls to the end alphabetically.
  const order = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  return Array.from(set).sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function upsertProduct(product: Product): void {
  const all = db.getProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    all[idx] = product;
  } else {
    all.unshift(product);
  }
  db.saveProducts(all);
}

export function deleteProduct(id: string): void {
  db.saveProducts(db.getProducts().filter((p) => p.id !== id));
}

export function adjustVariantStockForOrder(lines: { variantId: string; quantity: number }[]): void {
  const all = db.getProducts();
  for (const product of all) {
    for (const variant of product.variants) {
      const line = lines.find((l) => l.variantId === variant.id);
      if (line) variant.stock = Math.max(0, variant.stock - line.quantity);
    }
  }
  db.saveProducts(all);
}
