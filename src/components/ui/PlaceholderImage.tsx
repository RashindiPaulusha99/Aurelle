import { useState } from "react";
import { resolveImageUrl } from "@/lib/imageLibrary";

// Real brand photography doesn't exist yet. Renders a curated, deterministic Unsplash
// photo keyed by `seed` so the same product/image id always shows the same picture,
// with an editorial-toned gradient as the fallback if the image fails to load (offline, etc.).

interface PlaceholderImageProps {
  seed: string;
  label?: string;
  className?: string;
  aspect?: "square" | "portrait" | "wide" | "tall";
}

const GRADIENTS = [
  "linear-gradient(135deg, #e8ddcc 0%, #cbb89a 100%)",
  "linear-gradient(135deg, #d8cdb8 0%, #8a8178 100%)",
  "linear-gradient(135deg, #b4532a 0%, #7a3a1e 100%)",
  "linear-gradient(135deg, #cbb89a 0%, #a68f6c 100%)",
  "linear-gradient(135deg, #161412 0%, #3a352f 100%)",
  "linear-gradient(135deg, #e0d3bd 0%, #b4532a 100%)",
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const ASPECT_CLASS: Record<NonNullable<PlaceholderImageProps["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  tall: "aspect-[2/3]",
};

export function PlaceholderImage({ seed, label, className = "", aspect = "portrait" }: PlaceholderImageProps) {
  const [errored, setErrored] = useState(false);
  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length];
  const isDark = gradient.includes("#161412") || gradient.includes("#b4532a") || gradient.includes("#7a3a1e");
  const photoUrl = resolveImageUrl(seed);

  return (
    <div
      className={`relative overflow-hidden ${ASPECT_CLASS[aspect]} ${className}`}
      style={errored ? { background: gradient } : undefined}
    >
      {!errored && (
        <img
          src={photoUrl}
          alt={label ?? seed}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
      {errored && label && (
        <span
          role="img"
          aria-label={label}
          className={`absolute bottom-2 left-2 right-2 truncate font-body text-[10px] uppercase tracking-wide ${
            isDark ? "text-ivory/70" : "text-ink/50"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
