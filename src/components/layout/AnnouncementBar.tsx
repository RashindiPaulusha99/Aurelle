import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const MESSAGES = [
  "Free island-wide delivery on orders over LKR 8,000",
  "New arrivals dropped weekly — shop the latest edit",
  "Join us on Telegram for early access to drops",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-ink px-4 text-center text-[11px] uppercase tracking-wide text-ivory">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -6 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
          className="truncate"
        >
          {MESSAGES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
