import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  tone?: "default" | "success" | "error";
}

interface UiState {
  miniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
}

let toastCounter = 0;

export const useUiStore = create<UiState>((set, get) => ({
  miniCartOpen: false,
  setMiniCartOpen: (open) => set({ miniCartOpen: open }),
  toasts: [],
  pushToast: (message, tone = "default") => {
    toastCounter += 1;
    const id = `toast-${toastCounter}`;
    set({ toasts: [...get().toasts, { id, message, tone }] });
    setTimeout(() => get().dismissToast(id), 3200);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
