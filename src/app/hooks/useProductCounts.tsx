"use client";

import { useEffect, useState } from "react";

export function useProductCounts() {
  const [counts, setCounts] = useState({
    products: 0,
    phones: 0,
    laptop: 0,
    sketchPad: 0,
    pencil: 0,
    headphones: 0, // 🔹 Added
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [
          productsRes,
          phonesRes,
          laptopRes,
          sketchPadRes,
          pencilRes,
          headphonesRes, // 🔹 Added
        ] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/phones"),
          fetch("/api/laptops"),
          fetch("/api/sketchpad"),
          fetch("/api/pencils"),
          fetch("/api/headphone"), // 🔹 Added
        ]);

        const [
          products,
          phones,
          laptop,
          sketchPad,
          pencil,
          headphones, // 🔹 Added
        ] = await Promise.all([
          productsRes.json(),
          phonesRes.json(),
          laptopRes.json(),
          sketchPadRes.json(),
          pencilRes.json(),
          headphonesRes.json(), // 🔹 Added
        ]);

        const productsCount = Array.isArray(products)
          ? products.length
          : Array.isArray(products?.data)
          ? products.data.length
          : 0;

        const phonesCount = Array.isArray(phones)
          ? phones.length
          : Array.isArray(phones?.data)
          ? phones.data.length
          : 0;

        const laptopCount = Array.isArray(laptop)
          ? laptop.length
          : Array.isArray(laptop?.data)
          ? laptop.data.length
          : 0;

        const sketchPadCount = Array.isArray(sketchPad)
          ? sketchPad.length
          : Array.isArray(sketchPad?.data)
          ? sketchPad.data.length
          : 0;

        const pencilCount = Array.isArray(pencil)
          ? pencil.length
          : Array.isArray(pencil?.data)
          ? pencil.data.length
          : 0;

        const headphonesCount = Array.isArray(headphones) // 🔹 Added
          ? headphones.length
          : Array.isArray(headphones?.data)
          ? headphones.data.length
          : 0;

        setCounts({
          products: productsCount,
          phones: phonesCount,
          laptop: laptopCount,
          sketchPad: sketchPadCount,
          pencil: pencilCount,
          headphones: headphonesCount,
          total:
            productsCount +
            phonesCount +
            laptopCount +
            sketchPadCount +
            pencilCount +
            headphonesCount,
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
