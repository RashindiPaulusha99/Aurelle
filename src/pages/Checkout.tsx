import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useCartStore, resolveCartLines } from "@/store/cartStore";
import { useCurrentCustomer } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { formatLKR } from "@/lib/format";
import { DISTRICTS, COLOMBO_DELIVERY_FEE_CENTS, OUTSTATION_DELIVERY_FEE_CENTS, FREE_DELIVERY_THRESHOLD_CENTS } from "@/data/mock/locations";
import { checkCoupon } from "@/data/coupons";
import { createOrder } from "@/data/orders";
import type { PaymentMethod, OrderLineItem } from "@/data/types";

const DISTRICT_NAMES = Object.keys(DISTRICTS);

export function Checkout() {
  const navigate = useNavigate();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const customer = useCurrentCustomer();
  const pushToast = useUiStore((s) => s.pushToast);

  const resolved = resolveCartLines(lines);
  const subtotalCents = resolved.reduce((sum, r) => sum + r.product.priceCents * r.line.quantity, 0);

  const defaultAddress = customer?.addresses.find((a) => a.isDefault) ?? customer?.addresses[0];

  const [email, setEmail] = useState(customer?.email ?? "");
  const [recipientName, setRecipientName] = useState(defaultAddress?.recipientName ?? customer?.name ?? "");
  const [phone, setPhone] = useState(defaultAddress?.phone ?? customer?.phone ?? "");
  const [district, setDistrict] = useState(defaultAddress?.district ?? DISTRICT_NAMES[0]);
  const [city, setCity] = useState(defaultAddress?.city ?? DISTRICTS[DISTRICT_NAMES[0]][0]);
  const [addressLine, setAddressLine] = useState(defaultAddress?.addressLine ?? "");
  const [giftNote, setGiftNote] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountCents: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("payhere");
  const [telegramOptIn, setTelegramOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryZone: "colombo" | "outstation" = district === "Colombo" ? "colombo" : "outstation";
  const baseDeliveryFeeCents = deliveryZone === "colombo" ? COLOMBO_DELIVERY_FEE_CENTS : OUTSTATION_DELIVERY_FEE_CENTS;
  const deliveryFeeCents = subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : baseDeliveryFeeCents;
  const discountCents = appliedCoupon?.discountCents ?? 0;
  const totalCents = subtotalCents + deliveryFeeCents - discountCents;

  const cityOptions = useMemo(() => DISTRICTS[district] ?? [], [district]);

  // Skip the empty-cart redirect while a submission is in flight (or just succeeded) —
  // createOrder() clears the cart before the router has actually navigated away from
  // /checkout, and without this guard that empty-cart state bounces us back to /cart
  // instead of landing on the order confirmation page.
  if (resolved.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />;
  }

  function applyCoupon() {
    if (!couponInput.trim()) return;
    const result = checkCoupon(couponInput, subtotalCents);
    if (!result.ok) {
      setCouponError(result.error ?? "Invalid code");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code: result.coupon!.code, discountCents: result.discountCents });
    setCouponError(null);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!email.includes("@")) next.email = "Enter a valid email address.";
    if (!recipientName.trim()) next.recipientName = "Recipient name is required.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    if (!addressLine.trim()) next.addressLine = "Street address is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const items: OrderLineItem[] = resolved.map(({ product, variant, image, line }) => ({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      color: variant.color,
      priceCents: product.priceCents,
      quantity: line.quantity,
      imageUrl: image.url,
    }));

    const order = await createOrder({
      customerId: customer?.id,
      guestEmail: customer ? undefined : email,
      items,
      subtotalCents,
      deliveryFeeCents,
      discountCents,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      shippingAddress: { recipientName, phone, district, city, addressLine },
      deliveryZone,
    });

    // Navigate away from /checkout first — clearing the cart makes `resolved.length === 0`,
    // which would otherwise trigger the empty-cart <Navigate to="/cart"> guard above and
    // race the redirect to the confirmation page.
    navigate(`/order-confirmation/${order.id}`);
    clearCart();
    pushToast("Order placed successfully", "success");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="mb-4 font-display text-lg">Contact</h2>
            {!customer && (
              <p className="mb-3 text-xs text-stone">
                Checking out as a guest. <a href="/login" className="underline">Log in</a> to use a saved address.
              </p>
            )}
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} error={errors.recipientName} required />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} required />
              <Select label="District" value={district} onChange={(e) => {
                setDistrict(e.target.value);
                setCity(DISTRICTS[e.target.value][0]);
              }}>
                {DISTRICT_NAMES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
              <Select label="City / Area" value={city} onChange={(e) => setCity(e.target.value)}>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <div className="sm:col-span-2">
                <Input label="Street address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} error={errors.addressLine} required />
              </div>
              <div className="sm:col-span-2">
                <Input label="Gift note (optional)" value={giftNote} onChange={(e) => setGiftNote(e.target.value)} />
              </div>
            </div>
            <p className="mt-3 text-xs text-stone">
              Delivery zone: <strong>{deliveryZone === "colombo" ? "Colombo" : "Outstation"}</strong> —{" "}
              {deliveryFeeCents === 0 ? "Free (order over threshold)" : formatLKR(baseDeliveryFeeCents)}
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg">Payment Method</h2>
            <div className="flex flex-col gap-3">
              {([
                { id: "payhere", label: "PayHere (Card / eZ Cash / mCash / Genie)" },
                { id: "cod", label: "Cash on Delivery" },
                { id: "bank-transfer", label: "Bank Transfer (upload slip after order)" },
              ] as { id: PaymentMethod; label: string }[]).map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 border p-3 text-sm ${paymentMethod === opt.id ? "border-ink" : "border-stone/25"}`}>
                  <input type="radio" name="payment" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-terracotta" />
                  {opt.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone">
              This is a demo checkout — no real payment is processed. Orders always complete successfully for testing.
            </p>
          </section>

          <section>
            <label className="flex items-center gap-2 text-sm text-stone/70">
              <input type="checkbox" disabled checked={telegramOptIn} onChange={(e) => setTelegramOptIn(e.target.checked)} />
              Get order updates on Telegram <span className="text-[10px] uppercase">(coming soon)</span>
            </label>
          </section>
        </div>

        <aside className="h-fit border border-stone/15 p-6">
          <h2 className="mb-4 font-display text-lg">Order Summary</h2>
          <ul className="mb-5 flex flex-col gap-3">
            {resolved.map(({ product, variant, line, image }) => (
              <li key={variant.id} className="flex gap-3">
                <PlaceholderImage seed={image.url} aspect="square" className="w-14" />
                <div className="flex-1 text-xs">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-stone">{variant.color} · {variant.size} · Qty {line.quantity}</p>
                </div>
                <span className="text-sm">{formatLKR(product.priceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex gap-2">
            <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
            <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>
          {couponError && <p className="mb-3 text-xs text-terracotta">{couponError}</p>}
          {appliedCoupon && <p className="mb-3 text-xs text-ink">Applied "{appliedCoupon.code}" — -{formatLKR(appliedCoupon.discountCents)}</p>}

          <div className="flex flex-col gap-2 border-t border-stone/15 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatLKR(subtotalCents)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFeeCents === 0 ? "Free" : formatLKR(deliveryFeeCents)}</span></div>
            {discountCents > 0 && <div className="flex justify-between text-terracotta"><span>Discount</span><span>-{formatLKR(discountCents)}</span></div>}
            <div className="flex justify-between border-t border-stone/15 pt-2 font-medium"><span>Total</span><span>{formatLKR(totalCents)}</span></div>
          </div>

          <Button type="submit" variant="accent" fullWidth className="mt-6" disabled={submitting}>
            {submitting ? "Processing…" : `Place Order — ${formatLKR(totalCents)}`}
          </Button>
        </aside>
      </form>
    </div>
  );
}
