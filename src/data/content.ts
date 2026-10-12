import { db } from "./db";
import { generateId } from "@/lib/format";
import type { HeroSlide } from "./types";

export function getHeroSlides(): HeroSlide[] {
  return db.getHeroSlides();
}

export function upsertHeroSlide(slide: Omit<HeroSlide, "id"> & { id?: string }): void {
  const slides = db.getHeroSlides();
  if (slide.id) {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx >= 0) {
      slides[idx] = slide as HeroSlide;
      db.saveHeroSlides(slides);
      return;
    }
  }
  slides.push({ ...slide, id: generateId("hero") });
  db.saveHeroSlides(slides);
}

export function deleteHeroSlide(id: string): void {
  db.saveHeroSlides(db.getHeroSlides().filter((s) => s.id !== id));
}

export function reorderHeroSlides(orderedIds: string[]): void {
  const slides = db.getHeroSlides();
  const byId = new Map(slides.map((s) => [s.id, s]));
  const reordered = orderedIds.map((id) => byId.get(id)).filter((s): s is HeroSlide => Boolean(s));
  db.saveHeroSlides(reordered);
}
