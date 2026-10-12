import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TONE_CLASS: Record<string, string> = {
  default: "bg-ink text-ivory",
  success: "bg-ink text-ivory",
  error: "bg-terracotta text-ivory",
};

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 16 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-[var(--radius-ui)] px-4 py-3 text-sm shadow-lg ${TONE_CLASS[toast.tone ?? "default"]}`}
          >
            {toast.message}
            <button onClick={() => dismiss(toast.id)} aria-label="Dismiss" className="text-ivory/70 hover:text-ivory">
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
