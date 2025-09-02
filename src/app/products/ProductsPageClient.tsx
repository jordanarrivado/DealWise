"use client";

import { useEffect, useState } from "react";
import ProductComparison from "./ProductComparison";
import { Product } from "@/types/product";

export default function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const parsedProducts: Product[] = data.map((p: any) => ({
          ...p,
          offers: (p.offers || []).map((o: any) => ({
            ...o,
            price: Number(o.price),
            rating: Number(o.rating),
            reviews: Number(o.reviews),
          })),
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

  return <ProductComparison products={products} />;
}
