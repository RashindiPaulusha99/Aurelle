// localStorage-backed persistence for the mock data layer.
// This is the ONLY module that touches window.localStorage directly for domain data.
// Swapping to a real backend later means replacing the bodies of products.ts / orders.ts /
// customers.ts / coupons.ts / content.ts with fetch() calls — nothing above this layer changes.

import type { Product, Order, Customer, Coupon, HeroSlide } from "./types";
import { PRODUCTS } from "./mock/products";
import { HERO_SLIDES } from "./mock/heroSlides";
import { COUPONS } from "./mock/coupons";
import { CUSTOMERS } from "./mock/customers";

const KEYS = {
  products: "aurelle:products",
  orders: "aurelle:orders",
  customers: "aurelle:customers",
  coupons: "aurelle:coupons",
  heroSlides: "aurelle:heroSlides",
  seeded: "aurelle:seeded:v3",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEYS.seeded)) return;

  write(KEYS.products, PRODUCTS);
  write(KEYS.orders, [] as Order[]);
  write(KEYS.customers, CUSTOMERS);
  write(KEYS.coupons, COUPONS);
  write(KEYS.heroSlides, HERO_SLIDES);
  window.localStorage.setItem(KEYS.seeded, "1");
}

seedIfNeeded();

export const db = {
  getProducts(): Product[] {
    return read(KEYS.products, PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    write(KEYS.products, products);
  },
  getOrders(): Order[] {
    return read(KEYS.orders, [] as Order[]);
  },
  saveOrders(orders: Order[]): void {
    write(KEYS.orders, orders);
  },
  getCustomers(): Customer[] {
    return read(KEYS.customers, CUSTOMERS);
  },
  saveCustomers(customers: Customer[]): void {
    write(KEYS.customers, customers);
  },
  getCoupons(): Coupon[] {
    return read(KEYS.coupons, COUPONS);
  },
  saveCoupons(coupons: Coupon[]): void {
    write(KEYS.coupons, coupons);
  },
  getHeroSlides(): HeroSlide[] {
    return read(KEYS.heroSlides, HERO_SLIDES);
  },
  saveHeroSlides(slides: HeroSlide[]): void {
    write(KEYS.heroSlides, slides);
  },
  /** Dev/demo escape hatch: wipes all VALESTRA keys and re-seeds from the static mock arrays. */
  resetAll(): void {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
    seedIfNeeded();
  },
};
