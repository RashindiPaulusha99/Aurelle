import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "right" | "bottom";
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, side = "right", children }: DrawerProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const variants =
    side === "right"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={
              side === "right"
                ? "relative ml-auto flex h-full w-full max-w-md flex-col bg-ivory shadow-xl"
                : "relative mt-auto flex max-h-[85vh] w-full flex-col rounded-t-md bg-ivory shadow-xl"
            }
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-stone/15 px-5 py-4">
              {title && <h3 className="font-display text-lg">{title}</h3>}
              <button onClick={onClose} aria-label="Close" className="focus-ring text-stone hover:text-ink">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
