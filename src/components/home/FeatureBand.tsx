import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const FEATURES = [
  {
    title: "Virtual Try-On",
    copy: "See it on you before you buy — free AR preview, right from your browser.",
    href: "/try-on",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="12" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    title: "Find Your Size",
    copy: "A 60-second quiz that gives you a personal size recommendation — no more guessing.",
    href: "/find-my-size",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V4m16 16V4M4 8h4M4 14h4m12-6h-4m4 6h-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeatureBand() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-stone/20 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.1 }}
            className="flex flex-col items-start gap-4 bg-sand px-6 py-12 sm:px-12"
          >
            <div className="text-terracotta">{f.icon}</div>
            <h3 className="font-display text-2xl">{f.title}</h3>
            <p className="max-w-xs text-sm text-ink/70">{f.copy}</p>
            <Link to={f.href} className="focus-ring text-sm font-semibold uppercase tracking-wide text-ink underline">
              {f.title === "Virtual Try-On" ? "Try it now" : "Take the quiz"}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
