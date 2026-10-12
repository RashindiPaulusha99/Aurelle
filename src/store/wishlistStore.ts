import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import { toggleWishlist as toggleWishlistOnCustomer, getCustomerById } from "@/data/customers";

interface WishlistState {
  guestIds: string[];
  toggleGuest: (productId: string) => void;
}

/** Guest wishlist persists locally; once logged in, the customer record (data layer) is the source of truth. */
const useGuestWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      guestIds: [],
      toggleGuest: (productId) => {
        const has = get().guestIds.includes(productId);
        set({ guestIds: has ? get().guestIds.filter((id) => id !== productId) : [...get().guestIds, productId] });
      },
    }),
    { name: "aurelle:wishlist-guest" },
  ),
);

export function useWishlistIds(): string[] {
  const customerId = useAuthStore((s) => s.customerId);
  const guestIds = useGuestWishlistStore((s) => s.guestIds);
  if (customerId) return getCustomerById(customerId)?.wishlistIds ?? [];
  return guestIds;
}

export function useToggleWishlist() {
  const customerId = useAuthStore((s) => s.customerId);
  const toggleGuest = useGuestWishlistStore((s) => s.toggleGuest);
  return (productId: string) => {
    if (customerId) toggleWishlistOnCustomer(customerId, productId);
    else toggleGuest(productId);
  };
}
