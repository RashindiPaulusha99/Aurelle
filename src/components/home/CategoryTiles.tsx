import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CATEGORY_TILES } from "@/data/mock/categories";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function CategoryTiles() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {CATEGORY_TILES.map((tile, i) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.08 }}
          >
            <Link to={tile.href} className="group relative block overflow-hidden">
              <PlaceholderImage seed={tile.seed} aspect="tall" className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-lg text-ivory transition-transform duration-300 group-hover:-translate-y-1 sm:text-xl">
                {tile.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
