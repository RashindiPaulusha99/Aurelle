import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { getProducts, deleteProduct } from "@/data/products";
import { formatLKR } from "@/lib/format";
import { AdminProductForm } from "./AdminProductForm";

function ProductsList() {
  const [products, setProducts] = useState(() => getProducts());

  function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    deleteProduct(id);
    setProducts(getProducts());
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link to="/admin/products/new">
          <Button variant="primary">Add Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto border border-stone/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id} className="border-t border-stone/10">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <PlaceholderImage seed={product.images[0]?.url ?? product.slug} aspect="square" className="w-10" />
                    {product.name}
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category} / {product.subcategory}</td>
                  <td className="px-4 py-3">{formatLKR(product.priceCents)}</td>
                  <td className="px-4 py-3">{stock === 0 ? <Badge tone="low-stock">Sold out</Badge> : stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.tags.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${product.id}`} className="focus-ring mr-3 underline">Edit</Link>
                    <button onClick={() => handleDelete(product.id)} className="focus-ring text-terracotta underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminProducts() {
  return (
    <Routes>
      <Route index element={<ProductsList />} />
      <Route path="new" element={<AdminProductForm />} />
      <Route path=":productId" element={<AdminProductForm />} />
    </Routes>
  );
}
