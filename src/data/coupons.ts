import { db } from "./db";
import { generateId } from "@/lib/format";
import type { Coupon } from "./types";

export function getCoupons(): Coupon[] {
  return db.getCoupons();
}

export interface CouponCheckResult {
  ok: boolean;
  discountCents: number;
  error?: string;
  coupon?: Coupon;
}

export function checkCoupon(code: string, subtotalCents: number): CouponCheckResult {
  const coupon = db.getCoupons().find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  if (!coupon || !coupon.active) return { ok: false, discountCents: 0, error: "Invalid or expired coupon code." };
  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) {
    return {
      ok: false,
      discountCents: 0,
      error: `This code requires a minimum subtotal of LKR ${(coupon.minSubtotalCents / 100).toLocaleString()}.`,
    };
  }
  const discountCents = coupon.type === "percent" ? Math.round((subtotalCents * coupon.value) / 100) : coupon.value;
  return { ok: true, discountCents: Math.min(discountCents, subtotalCents), coupon };
}

export function upsertCoupon(coupon: Omit<Coupon, "id"> & { id?: string }): void {
  const coupons = db.getCoupons();
  if (coupon.id) {
    const idx = coupons.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      coupons[idx] = coupon as Coupon;
      db.saveCoupons(coupons);
      return;
    }
  }
  coupons.unshift({ ...coupon, id: generateId("cpn") });
  db.saveCoupons(coupons);
}

export function deleteCoupon(id: string): void {
  db.saveCoupons(db.getCoupons().filter((c) => c.id !== id));
}
