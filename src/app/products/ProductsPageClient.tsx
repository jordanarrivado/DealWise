"use client";

import { useEffect, useState } from "react";
import ProductComparison from "./ProductComparison";
import type { Product } from "@/types/product";

export default function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data: Product[] = await res.json(); // TypeScript knows this is Product[]

        // Optional: ensure all numeric fields are actually numbers
        const parsedProducts: Product[] = data.map((p) => ({
          ...p,
          offers: (p.offers || []).map((o) => ({
            merchant: o.merchant,
            price: Number(o.price),
            url: o.url,
            rating: Number(o.rating ?? 0),
            reviews: Number(o.reviews ?? 0),
          })),
          category: p.category ?? "",
          desc: p.desc ?? [],
        }));

        setProducts(parsedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (products.length === 0)
    return <p className="text-center mt-10">No products found.</p>;

  return (
    <ProductComparison
      products={products.map((p) => ({
        title: p.title,
        image: p.image,
        category: p.category,
        offers: p.offers,
        desc: p.desc,
      }))}
    />
  );
}
