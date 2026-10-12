import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/data/types";
import { getCustomerById } from "@/data/customers";

interface AuthState {
  customerId: string | null;
  login: (customerId: string) => void;
  logout: () => void;
  currentCustomer: () => Customer | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customerId: null,
      login: (customerId) => set({ customerId }),
      logout: () => set({ customerId: null }),
      currentCustomer: () => {
        const id = get().customerId;
        return id ? getCustomerById(id) : undefined;
      },
    }),
    { name: "aurelle:auth" },
  ),
);

export function useCurrentCustomer(): Customer | undefined {
  // Re-reads from the data layer each render so admin/profile edits reflect immediately,
  // while still subscribing to customerId changes for login/logout re-renders.
  const customerId = useAuthStore((s) => s.customerId);
  return customerId ? getCustomerById(customerId) : undefined;
}

export function useIsAdmin(): boolean {
  const customer = useCurrentCustomer();
  return customer?.role === "admin";
}
