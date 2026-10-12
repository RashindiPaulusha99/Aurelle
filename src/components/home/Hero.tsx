import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { HeroSlide } from "@/data/types";

const AUTOPLAY_MS = 6000;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, slides.length]);

  if (!slides.length) return null;
  const slide = slides[index];
  const isInk = slide.theme === "ink";

  return (
    <section
      className="relative h-[560px] overflow-hidden sm:h-[680px] lg:h-[88vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 50) prev();
        else if (delta < -50) next();
        touchStartX.current = null;
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: reduced ? 1 : 1.08 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          >
            <PlaceholderImage seed={slide.imageUrl} label={slide.imageUrl} aspect="wide" className="h-full w-full" />
          </motion.div>
          <div className={`absolute inset-0 ${isInk ? "bg-ink/40" : "bg-ivory/10"}`} />

          <div className="absolute bottom-10 left-0 w-full px-5 sm:bottom-16 sm:left-12 sm:w-auto sm:px-0 lg:bottom-20 lg:left-20">
            <div className={isInk ? "text-ivory" : "text-ink"}>
              <motion.h1
                className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.15 }}
              >
                {slide.headline}
                <br />
                <span className="accent-italic text-terracotta">{slide.accentWord}</span>
              </motion.h1>
              <motion.p
                className="mt-4 max-w-sm text-sm sm:text-base"
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.3 }}
              >
                {slide.subcopy}
              </motion.p>
              <motion.div
                className="mt-6 flex gap-3"
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.45 }}
              >
                <Link to={slide.ctaHref}>
                  <Button variant={isInk ? "primary" : "accent"}>{slide.ctaLabel}</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-5 left-5 flex gap-2 sm:left-12">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-0.5 w-10 overflow-hidden bg-ivory/40"
              >
                {i === index && (
                  <motion.div
                    className="h-full bg-terracotta"
                    key={`${slide.id}-${paused}`}
                    initial={{ width: "0%" }}
                    animate={{ width: paused || reduced ? "100%" : "100%" }}
                    transition={{ duration: paused || reduced ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className={`absolute bottom-5 right-5 text-xs sm:right-12 ${isInk ? "text-ivory/80" : "text-ink/70"}`}>
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
        </>
      )}
    </section>
  );
}
