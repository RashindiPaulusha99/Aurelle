// Domain types for the mock data layer.
// Mirrors the eventual Spring Boot DTOs so swapping this layer for real API calls
// later doesn't require touching components. Prices are stored as integer cents (LKR).

export type FitPreference = "slim" | "regular" | "loose";
export type BodyShape = "rectangle" | "triangle" | "inverted-triangle" | "oval" | "hourglass";
export type AgeRange = "under-18" | "18-24" | "25-34" | "35-44" | "45-plus";

export interface SizeChartRow {
  size: string; // e.g. "S", "M", "L"
  chestCm: number;
  waistCm: number;
  hipCm: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string; // placeholder gradient id, resolved by PlaceholderImage component
  alt: string;
  color?: string; // ties image to a color swatch
}

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string; // ISO
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "women" | "accessories";
  subcategory: string;
  tags: string[]; // "new", "sale", "best-seller"
  priceCents: number;
  compareAtCents?: number;
  description: string;
  images: ProductImage[];
  colors: { name: string; hex: string }[];
  variants: ProductVariant[];
  sizeChart: SizeChartRow[];
  tryOnReady: boolean;
  reviews: Review[];
  createdAt: string; // ISO, drives "new arrivals"
}

export interface HeroSlide {
  id: string;
  headline: string;
  accentWord: string;
  subcopy: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  theme: "ivory" | "ink";
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  district: string;
  city: string;
  addressLine: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // PLAINTEXT MOCK ONLY — never do this with a real backend
  role: "customer" | "admin";
  addresses: Address[];
  sizeProfile?: SizeProfile;
  wishlistIds: string[];
  createdAt: string;
}

export interface SizeProfile {
  heightCm: number;
  weightKg: number;
  ageRange: AgeRange;
  bodyShape: BodyShape;
  fitPreference: FitPreference;
  savedAt: string;
}

export type PaymentMethod = "payhere" | "cod" | "bank-transfer";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderLineItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  color: string;
  priceCents: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestEmail?: string;
  items: OrderLineItem[];
  subtotalCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  totalCents: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  shippingAddress: Omit<Address, "id" | "label" | "isDefault">;
  deliveryZone: "colombo" | "outstation";
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number; // percent 0-100, or flat cents
  minSubtotalCents?: number;
  active: boolean;
}

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}
