"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ProductComparisonProps } from "@/types/product";

type SortOption = "priceLow" | "rating";

export default function ProductComparison({
  products,
}: ProductComparisonProps) {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [products]);

  // Filter, enhance, and sort products
  const filteredAndSortedProducts = useMemo(() => {
    return (products || [])
      .filter((product) => {
        const matchesSearch = product.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
        const matchesCategory =
          categoryFilter === "All" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .map((product) => ({
        ...product,
        minPrice: product.offers.length
          ? Math.min(...product.offers.map((o) => o.price))
          : 0,
        maxRating: product.offers.length
          ? Math.max(...product.offers.map((o) => o.rating))
          : 0,
      }))
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.minPrice - b.minPrice;
        if (sortBy === "rating") return b.maxRating - a.maxRating;
        return 0;
      });
  }, [products, searchQuery, sortBy, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        🔥 Best Deal Products
      </h2>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 w-full px-2 sm:px-0 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
          className="w-full sm:max-w-md px-5 py-4 border border-gray-300 rounded-3xl shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 placeholder-gray-400 transition"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-3xl shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <span className="block text-center mb-6 text-sm text-gray-600 dark:text-gray-300">
        {filteredAndSortedProducts.length} product
        {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
      </span>

      {/* Sort Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6 gap-4 flex-wrap"
      >
        {[
          { key: "priceLow", label: "💰 Lowest Price" },
          { key: "rating", label: "⭐ Top Rated" },
        ].map((btn) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            key={btn.key}
            onClick={() => setSortBy(btn.key as SortOption)}
            className={clsx(
              "px-6 py-3 rounded-2xl font-semibold backdrop-blur-md transition-colors duration-200 cursor-pointer shadow-lg",
              sortBy === btn.key
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            )}
          >
            {btn.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            No products found.
          </p>
          <Link href="/add-product" className="text-blue-600 underline">
            Add a new product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredAndSortedProducts.map((product) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl shadow-2xl transition bg-gradient-to-tr from-blue-50/40 via-purple-50/30 to-pink-50/10 backdrop-blur-md dark:from-gray-900/40 dark:via-purple-900/30 dark:to-pink-900/10 "
            >
              {/* Image & Title */}
              <div className="flex flex-col items-center p-6 sm:p-8 relative z-10 ">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={140}
                  height={140}
                  className="rounded-xl object-cover mb-4 shadow-md"
                  loading="lazy"
                />
                <h3 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100">
                  {product.title}
                </h3>
                {product.category && (
                  <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.desc && (
                <div className="px-6 sm:px-8 pb-4 text-sm text-gray-700 dark:text-gray-300 relative z-10 space-y-1">
                  {product.desc.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {/* Offers */}
              <div className="px-6 pt-5 sm:px-8 pb-6 relative z-10 max-h-68 space-y-3 overflow-y-auto scroll-smooth">
                {product.offers.map((offer, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "relative grid grid-rows-[auto_auto] gap-1 p-3 rounded-xl shadow-md transition-all text-sm w-full",
                      offer.price === product.minPrice
                        ? "bg-green-100/70 dark:bg-green-700/50 ring-2 ring-green-400"
                        : "bg-white/70 dark:bg-gray-800/60"
                    )}
                  >
                    {offer.price === product.minPrice && (
                      <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        BEST DEAL
                      </span>
                    )}

                    {/* Top row: Merchant | Price | Rating */}
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                      <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                        {offer.merchant}
                      </span>
                      <span
                        className={clsx(
                          "font-bold",
                          offer.price === product.minPrice
                            ? "text-green-700 dark:text-green-200"
                            : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        ₱{offer.price.toLocaleString()}{" "}
                        {offer.price === product.minPrice && "🏆"}
                      </span>
                      <span
                        className={clsx(
                          "font-semibold",
                          offer.rating === product.maxRating
                            ? "text-yellow-600 dark:text-yellow-300"
                            : "text-gray-500"
                        )}
                      >
                        ⭐ {offer.rating}{" "}
                        {offer.rating === product.maxRating && "🏅"}
                      </span>
                    </div>

                    {/* Bottom row: Reviews + Link */}
                    <div className="flex justify-between items-center mt-1">
                      <span className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                        {offer.reviews} review{offer.reviews !== 1 ? "s" : ""}
                      </span>

                      <Link
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-semibold shadow hover:shadow-lg transition"
                      >
                        Go
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
