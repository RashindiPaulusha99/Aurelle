import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { ProductImage } from "@/data/types";

export function Gallery({ images, activeColor, productName }: { images: ProductImage[]; activeColor?: string; productName: string }) {
  const filtered = activeColor ? images.filter((img) => img.color === activeColor) : images;
  const list = filtered.length ? filtered : images;
  const [activeIndex, setActiveIndex] = useState(0);

  const active = list[Math.min(activeIndex, list.length - 1)] ?? list[0];

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
      <div className="flex-1">
        <PlaceholderImage seed={active.url} label={productName} aspect="portrait" className="w-full" />
      </div>
      <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
        {list.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1}`}
            className={`w-16 shrink-0 border-2 sm:w-full ${i === activeIndex ? "border-terracotta" : "border-transparent"}`}
          >
            <PlaceholderImage seed={img.url} aspect="square" />
          </button>
        ))}
      </div>
    </div>
  );
}
