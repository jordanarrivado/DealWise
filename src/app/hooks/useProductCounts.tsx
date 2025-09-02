"use client";

import { useEffect, useState } from "react";

export function useProductCounts() {
  const [counts, setCounts] = useState({ products: 0, phones: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [productsRes, phonesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/phones"),
        ]);

        const [products, phones] = await Promise.all([
          productsRes.json(),
          phonesRes.json(),
        ]);

        const productsCount = Array.isArray(products) ? products.length : 0;
        const phonesCount = Array.isArray(phones) ? phones.length : 0;

        setCounts({
          products: productsCount,
          phones: phonesCount,
          total: productsCount + phonesCount,
        });
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return { counts, loading };
}
