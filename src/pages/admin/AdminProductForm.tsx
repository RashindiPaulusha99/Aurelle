import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getProductById, upsertProduct } from "@/data/products";
import { generateId } from "@/lib/format";
import type { Product, ProductVariant, ProductImage } from "@/data/types";

const WOMEN_SIZE_CHART = [
  { size: "XS", chestCm: 80, waistCm: 64, hipCm: 88 },
  { size: "S", chestCm: 84, waistCm: 68, hipCm: 92 },
  { size: "M", chestCm: 88, waistCm: 72, hipCm: 96 },
  { size: "L", chestCm: 94, waistCm: 78, hipCm: 102 },
  { size: "XL", chestCm: 100, waistCm: 84, hipCm: 108 },
];

function blankProduct(): Product {
  return {
    id: generateId("prod"),
    slug: "",
    name: "",
    category: "women",
    subcategory: "dresses",
    tags: [],
    priceCents: 0,
    description: "",
    images: [],
    colors: [{ name: "Ivory", hex: "#f6f1ea" }],
    variants: [],
    sizeChart: WOMEN_SIZE_CHART,
    tryOnReady: false,
    reviews: [],
    createdAt: new Date().toISOString(),
  };
}

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function rebuildVariantsPreservingStock(product: Product, colors: Product["colors"], sizes: string[]): ProductVariant[] {
  const existing = new Map(product.variants.map((v) => [`${v.color}__${v.size}`, v]));
  const variants: ProductVariant[] = [];
  for (const color of colors) {
    for (const size of sizes) {
      const key = `${color.name}__${size}`;
      const prior = existing.get(key);
      variants.push(
        prior ?? {
          id: generateId("var"),
          sku: `${slugify(product.name).slice(0, 4).toUpperCase()}-${color.name.slice(0, 2).toUpperCase()}-${size}`,
          size,
          color: color.name,
          colorHex: color.hex,
          stock: 0,
        },
      );
    }
  }
  return variants;
}

function rebuildImages(colors: Product["colors"], slug: string): ProductImage[] {
  return colors.flatMap((color, idx) => [
    { id: `${slug}-${idx}-a`, url: `${slug}-${color.name}-a`, alt: "Front view", color: color.name },
    { id: `${slug}-${idx}-b`, url: `${slug}-${color.name}-b`, alt: "Detail view", color: color.name },
  ]);
}

export function AdminProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const existing = productId ? getProductById(productId) : undefined;

  const [product, setProduct] = useState<Product>(existing ?? blankProduct());
  const [sizesCsv, setSizesCsv] = useState(
    Array.from(new Set(product.variants.map((v) => v.size))).join(", ") || "XS, S, M, L, XL",
  );
  const [colorsCsv, setColorsCsv] = useState(product.colors.map((c) => `${c.name}:${c.hex}`).join(", "));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const slug = product.slug || slugify(product.name);
    const colors = colorsCsv
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((pair) => {
        const [name, hex] = pair.split(":").map((s) => s.trim());
        return { name, hex: hex || "#8a8178" };
      });
    const sizes = sizesCsv.split(",").map((s) => s.trim()).filter(Boolean);

    const finalProduct: Product = {
      ...product,
      slug,
      colors,
      images: product.images.length ? product.images : rebuildImages(colors, slug),
      variants: rebuildVariantsPreservingStock(product, colors, sizes),
    };

    upsertProduct(finalProduct);
    navigate("/admin/products");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl">{existing ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <Input label="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
        <Textarea label="Description" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={4} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Category" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value as Product["category"] })}>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="accessories">Accessories</option>
          </Select>
          <Input label="Subcategory" value={product.subcategory} onChange={(e) => setProduct({ ...product, subcategory: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price (LKR)"
            type="number"
            value={product.priceCents / 100}
            onChange={(e) => setProduct({ ...product, priceCents: Math.round(Number(e.target.value) * 100) })}
            required
          />
          <Input
            label="Compare-at price (LKR, optional)"
            type="number"
            value={product.compareAtCents ? product.compareAtCents / 100 : ""}
            onChange={(e) => setProduct({ ...product, compareAtCents: e.target.value ? Math.round(Number(e.target.value) * 100) : undefined })}
          />
        </div>

        <Input label="Colors (name:hex, comma separated)" value={colorsCsv} onChange={(e) => setColorsCsv(e.target.value)} hint="e.g. Terracotta:#b4532a, Ivory:#f6f1ea" />
        <Input label="Sizes (comma separated)" value={sizesCsv} onChange={(e) => setSizesCsv(e.target.value)} hint="e.g. XS, S, M, L, XL" />

        <div className="flex flex-wrap gap-2">
          {["new", "sale", "best-seller"].map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product.tags.includes(tag)}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    tags: e.target.checked ? [...product.tags, tag] : product.tags.filter((t) => t !== tag),
                  })
                }
                className="accent-terracotta"
              />
              {tag}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={product.tryOnReady}
              onChange={(e) => setProduct({ ...product, tryOnReady: e.target.checked })}
              className="accent-terracotta"
            />
            Try-on ready garment
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone">Product image (upload is mocked)</p>
          <div className="flex items-center gap-4">
            <PlaceholderImage seed={product.images[0]?.url ?? (product.slug || "new-product")} aspect="square" className="w-24" />
            <input
              type="file"
              accept="image/*"
              onChange={() => {
                // Mock-only: a real backend-connected admin would upload to S3 and
                // store the returned URL. Here we just acknowledge the file was picked.
              }}
              className="text-xs text-stone"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary">Save Product</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
