import type { Coupon } from "../types";

export const COUPONS: Coupon[] = [
  { id: "cpn-1", code: "WELCOME10", type: "percent", value: 10, active: true },
  { id: "cpn-2", code: "FREESHIP", type: "flat", value: 55000, minSubtotalCents: 500000, active: true },
  { id: "cpn-3", code: "AURELLE20", type: "percent", value: 20, minSubtotalCents: 1000000, active: true },
];
