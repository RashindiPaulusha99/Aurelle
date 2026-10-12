import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getHeroSlides, upsertHeroSlide, deleteHeroSlide } from "@/data/content";
import type { HeroSlide } from "@/data/types";

const emptyForm: Omit<HeroSlide, "id"> = {
  headline: "",
  accentWord: "",
  subcopy: "",
  ctaLabel: "Shop Now",
  ctaHref: "/catalog",
  imageUrl: "",
  theme: "ivory",
};

export function AdminHeroSlides() {
  const [slides, setSlides] = useState(() => getHeroSlides());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditingId(undefined);
    setForm({ ...emptyForm, imageUrl: `hero-${Date.now()}` });
    setModalOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm(slide);
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    upsertHeroSlide({ ...form, id: editingId });
    setSlides(getHeroSlides());
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this slide?")) return;
    deleteHeroSlide(id);
    setSlides(getHeroSlides());
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Hero Slides</h1>
        <Button variant="primary" onClick={openAdd}>Add Slide</Button>
      </div>

      <ul className="flex flex-col gap-4">
        {slides.map((slide) => (
          <li key={slide.id} className="flex gap-4 border border-stone/15 p-4">
            <PlaceholderImage seed={slide.imageUrl} aspect="wide" className="w-40" />
            <div className="flex-1">
              <p className="font-medium">
                {slide.headline} <span className="text-terracotta">{slide.accentWord}</span>
              </p>
              <p className="text-sm text-stone">{slide.subcopy}</p>
              <p className="mt-1 text-xs text-stone">CTA: {slide.ctaLabel} → {slide.ctaHref}</p>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => openEdit(slide)} className="focus-ring underline">Edit</button>
              <button onClick={() => handleDelete(slide.id)} className="focus-ring text-terracotta underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Slide" : "Add Slide"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} required />
          <Input label="Accent word" value={form.accentWord} onChange={(e) => setForm({ ...form, accentWord: e.target.value })} required />
          <Input label="Subcopy" value={form.subcopy} onChange={(e) => setForm({ ...form, subcopy: e.target.value })} required />
          <Input label="CTA label" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} required />
          <Input label="CTA link" value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} required />
          <Select label="Text theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value as HeroSlide["theme"] })}>
            <option value="ivory">Ivory background, dark text</option>
            <option value="ink">Dark overlay, light text</option>
          </Select>
          <Button type="submit" variant="primary">Save Slide</Button>
        </form>
      </Modal>
    </div>
  );
}
