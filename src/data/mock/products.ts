import type { Product, ProductVariant, ProductImage, SizeChartRow, Review } from "../types";

const WOMEN_SIZE_CHART: SizeChartRow[] = [
  { size: "XS", chestCm: 80, waistCm: 64, hipCm: 88 },
  { size: "S", chestCm: 84, waistCm: 68, hipCm: 92 },
  { size: "M", chestCm: 88, waistCm: 72, hipCm: 96 },
  { size: "L", chestCm: 94, waistCm: 78, hipCm: 102 },
  { size: "XL", chestCm: 100, waistCm: 84, hipCm: 108 },
];

const MEN_SIZE_CHART: SizeChartRow[] = [
  { size: "S", chestCm: 92, waistCm: 78, hipCm: 94 },
  { size: "M", chestCm: 98, waistCm: 84, hipCm: 100 },
  { size: "L", chestCm: 104, waistCm: 90, hipCm: 106 },
  { size: "XL", chestCm: 110, waistCm: 96, hipCm: 112 },
  { size: "XXL", chestCm: 116, waistCm: 102, hipCm: 118 },
];

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Nadeesha K.",
    rating: 5,
    title: "Fits perfectly",
    body: "True to size and the fabric feels premium. Ordered a size up per the guide and it was spot on.",
    date: "2026-08-14",
  },
  {
    id: "rev-2",
    author: "Ruwan P.",
    rating: 4,
    title: "Good quality, runs slightly large",
    body: "Nice stitching and colour. I'd size down if you're between sizes.",
    date: "2026-07-02",
  },
];

interface ProductTemplate {
  slug: string;
  name: string;
  category: Product["category"];
  subcategory: string;
  tags: string[];
  priceCents: number;
  compareAtCents?: number;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  tryOnReady: boolean;
  daysAgo: number;
}

const TEMPLATES: ProductTemplate[] = [
  {
    slug: "linen-wrap-midi-dress",
    name: "Linen Wrap Midi Dress",
    category: "women",
    subcategory: "dresses",
    tags: ["new", "best-seller"],
    priceCents: 849000,
    description:
      "A relaxed wrap silhouette cut from breathable linen-blend, finished with a self-tie waist. Island-ready and easy to dress up or down.",
    colors: [
      { name: "Terracotta", hex: "#b4532a" },
      { name: "Ivory", hex: "#f6f1ea" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 2,
  },
  {
    slug: "structured-shoulder-blouse",
    name: "Structured Shoulder Blouse",
    category: "women",
    subcategory: "tops",
    tags: ["new"],
    priceCents: 549000,
    description: "A sharp, architectural blouse with a structured shoulder and fluid crepe body for an elevated office edit.",
    colors: [
      { name: "Sand", hex: "#e8ddcc" },
      { name: "Ink", hex: "#161412" },
    ],
    sizes: ["XS", "S", "M", "L"],
    tryOnReady: true,
    daysAgo: 4,
  },
  {
    slug: "tailored-wide-leg-trouser",
    name: "Tailored Wide-Leg Trouser",
    category: "women",
    subcategory: "bottoms",
    tags: ["best-seller"],
    priceCents: 699000,
    description: "High-rise wide-leg trousers with a fluid drape, tailored for a long, clean line.",
    colors: [
      { name: "Stone", hex: "#8a8178" },
      { name: "Ink", hex: "#161412" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    tryOnReady: false,
    daysAgo: 20,
  },
  {
    slug: "silk-slip-occasion-dress",
    name: "Silk-Feel Slip Occasion Dress",
    category: "women",
    subcategory: "occasion",
    tags: ["sale"],
    priceCents: 749000,
    compareAtCents: 999000,
    description: "A bias-cut slip dress in a silk-feel satin, designed to move with you from dinner to dance floor.",
    colors: [
      { name: "Terracotta", hex: "#b4532a" },
      { name: "Sand", hex: "#e8ddcc" },
    ],
    sizes: ["XS", "S", "M", "L"],
    tryOnReady: true,
    daysAgo: 45,
  },
  {
    slug: "cotton-poplin-maxi-dress",
    name: "Cotton Poplin Maxi Dress",
    category: "women",
    subcategory: "dresses",
    tags: [],
    priceCents: 799000,
    description: "Floor-grazing poplin maxi with a cinched waist and statement sleeve for warm-weather occasions.",
    colors: [
      { name: "Ivory", hex: "#f6f1ea" },
      { name: "Terracotta", hex: "#b4532a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 60,
  },
  {
    slug: "ribbed-knit-tank",
    name: "Ribbed Knit Tank",
    category: "women",
    subcategory: "tops",
    tags: ["best-seller"],
    priceCents: 299000,
    description: "An everyday ribbed tank in a soft stretch knit — the foundation layer that works with everything.",
    colors: [
      { name: "Ink", hex: "#161412" },
      { name: "Sand", hex: "#e8ddcc" },
      { name: "Terracotta", hex: "#b4532a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 90,
  },
  {
    slug: "pleated-midi-skirt",
    name: "Pleated Satin Midi Skirt",
    category: "women",
    subcategory: "bottoms",
    tags: ["new", "sale"],
    priceCents: 599000,
    compareAtCents: 749000,
    description: "Fine knife pleats in a liquid satin finish — a midi skirt that catches the light with every step.",
    colors: [{ name: "Terracotta", hex: "#b4532a" }, { name: "Ink", hex: "#161412" }],
    sizes: ["XS", "S", "M", "L"],
    tryOnReady: false,
    daysAgo: 6,
  },
  {
    slug: "linen-blend-shirt-dress",
    name: "Linen-Blend Shirt Dress",
    category: "women",
    subcategory: "dresses",
    tags: [],
    priceCents: 779000,
    description: "A collared shirt dress with a self-belt, cut from a breathable linen blend for all-day ease.",
    colors: [{ name: "Sand", hex: "#e8ddcc" }, { name: "Stone", hex: "#8a8178" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 33,
  },
  {
    slug: "oxford-check-shirt",
    name: "Oxford Check Shirt",
    category: "men",
    subcategory: "shirts",
    tags: ["new"],
    priceCents: 599000,
    description: "A classic Oxford check in a soft cotton weave, tailored for a modern, slightly relaxed fit.",
    colors: [{ name: "Stone", hex: "#8a8178" }, { name: "Ink", hex: "#161412" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tryOnReady: true,
    daysAgo: 3,
  },
  {
    slug: "linen-resort-shirt",
    name: "Linen Resort Shirt",
    category: "men",
    subcategory: "shirts",
    tags: ["best-seller"],
    priceCents: 649000,
    description: "An open-weave linen shirt with a camp collar, built for humid days and golden-hour evenings.",
    colors: [{ name: "Ivory", hex: "#f6f1ea" }, { name: "Terracotta", hex: "#b4532a" }],
    sizes: ["S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 15,
  },
  {
    slug: "essential-crewneck-tee",
    name: "Essential Heavyweight Tee",
    category: "men",
    subcategory: "tshirts",
    tags: ["best-seller"],
    priceCents: 349000,
    description: "A heavyweight cotton tee with a structured crewneck that holds its shape wash after wash.",
    colors: [
      { name: "Ink", hex: "#161412" },
      { name: "Sand", hex: "#e8ddcc" },
      { name: "Stone", hex: "#8a8178" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tryOnReady: true,
    daysAgo: 70,
  },
  {
    slug: "garment-dyed-tee",
    name: "Garment-Dyed Pocket Tee",
    category: "men",
    subcategory: "tshirts",
    tags: ["new"],
    priceCents: 379000,
    description: "Garment-dyed for a lived-in look from day one, with a chest pocket and dropped shoulder.",
    colors: [{ name: "Terracotta", hex: "#b4532a" }, { name: "Stone", hex: "#8a8178" }],
    sizes: ["S", "M", "L", "XL"],
    tryOnReady: true,
    daysAgo: 8,
  },
  {
    slug: "tapered-chino-trouser",
    name: "Tapered Chino Trouser",
    category: "men",
    subcategory: "trousers",
    tags: [],
    priceCents: 699000,
    description: "A tapered chino in a mid-weight cotton twill, finished with a clean, uncuffed hem.",
    colors: [{ name: "Stone", hex: "#8a8178" }, { name: "Ink", hex: "#161412" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tryOnReady: false,
    daysAgo: 40,
  },
  {
    slug: "linen-blend-trouser",
    name: "Linen-Blend Drawstring Trouser",
    category: "men",
    subcategory: "trousers",
    tags: ["sale"],
    priceCents: 649000,
    compareAtCents: 799000,
    description: "An elasticated-waist linen-blend trouser with a tapered leg — tailoring with zero restriction.",
    colors: [{ name: "Ivory", hex: "#f6f1ea" }, { name: "Stone", hex: "#8a8178" }],
    sizes: ["S", "M", "L", "XL"],
    tryOnReady: false,
    daysAgo: 55,
  },
  {
    slug: "woven-raffia-tote",
    name: "Woven Raffia Tote",
    category: "accessories",
    subcategory: "bags",
    tags: ["new", "best-seller"],
    priceCents: 449000,
    description: "A handwoven raffia tote with leather handles, roomy enough for a beach day or a market run.",
    colors: [{ name: "Sand", hex: "#e8ddcc" }, { name: "Ivory", hex: "#f6f1ea" }],
    sizes: ["One Size"],
    tryOnReady: false,
    daysAgo: 5,
  },
  {
    slug: "structured-leather-crossbody",
    name: "Structured Leather Crossbody",
    category: "accessories",
    subcategory: "bags",
    tags: [],
    priceCents: 899000,
    description: "A clean-lined crossbody in vegetable-tanned leather with a brushed brass hardware finish.",
    colors: [{ name: "Terracotta", hex: "#b4532a" }, { name: "Ink", hex: "#161412" }],
    sizes: ["One Size"],
    tryOnReady: false,
    daysAgo: 25,
  },
  {
    slug: "layered-brass-necklace",
    name: "Layered Brass Necklace",
    category: "accessories",
    subcategory: "jewellery",
    tags: ["sale"],
    priceCents: 229000,
    compareAtCents: 299000,
    description: "A triple-layer brass necklace with a satin finish that won't tarnish in the island humidity.",
    colors: [{ name: "Brass", hex: "#b4532a" }],
    sizes: ["One Size"],
    tryOnReady: false,
    daysAgo: 12,
  },
  {
    slug: "woven-leather-belt",
    name: "Woven Leather Belt",
    category: "accessories",
    subcategory: "bags",
    tags: [],
    priceCents: 259000,
    description: "An interwoven leather belt with a matte brass buckle — the finishing detail for tailored trousers.",
    colors: [{ name: "Stone", hex: "#8a8178" }, { name: "Ink", hex: "#161412" }],
    sizes: ["One Size"],
    tryOnReady: false,
    daysAgo: 48,
  },
];

function buildVariants(slug: string, colors: { name: string; hex: string }[], sizes: string[]): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let i = 0;
  for (const color of colors) {
    for (const size of sizes) {
      i += 1;
      // Deterministic pseudo-stock: a few sizes sell out to exercise the "greyed out" UI.
      const stock = (i * 7 + slug.length) % 6 === 0 ? 0 : ((i * 3) % 12) + 1;
      variants.push({
        id: `${slug}-${color.name.toLowerCase()}-${size}`.replace(/\s+/g, "-"),
        sku: `${slug.slice(0, 4).toUpperCase()}-${color.name.slice(0, 2).toUpperCase()}-${size}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock,
      });
    }
  }
  return variants;
}

function buildImages(slug: string, colors: { name: string; hex: string }[]): ProductImage[] {
  const images: ProductImage[] = [];
  colors.forEach((color, idx) => {
    images.push({ id: `${slug}-img-${idx}-a`, url: `${slug}-${color.name}-a`, alt: `Front view`, color: color.name });
    images.push({ id: `${slug}-img-${idx}-b`, url: `${slug}-${color.name}-b`, alt: `Detail view`, color: color.name });
  });
  return images;
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const PRODUCTS: Product[] = TEMPLATES.map((t, idx) => ({
  id: `prod-${idx + 1}`,
  slug: t.slug,
  name: t.name,
  category: t.category,
  subcategory: t.subcategory,
  tags: t.tags,
  priceCents: t.priceCents,
  compareAtCents: t.compareAtCents,
  description: t.description,
  images: buildImages(t.slug, t.colors),
  colors: t.colors,
  variants: buildVariants(t.slug, t.colors, t.sizes),
  sizeChart: t.category === "men" ? MEN_SIZE_CHART : t.sizes.includes("One Size") ? [] : WOMEN_SIZE_CHART,
  tryOnReady: t.tryOnReady,
  reviews: idx % 2 === 0 ? SAMPLE_REVIEWS : [SAMPLE_REVIEWS[0]],
  createdAt: daysAgoIso(t.daysAgo),
}));
