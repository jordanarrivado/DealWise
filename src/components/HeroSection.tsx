// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import Link from "next/link";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-3 sm:pt-1 text-center"
    >
      <SearchBar />

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-5">
        Welcome to DealWise 🚀
      </h1>

      <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Discover trending products from Shopee, TikTok Shop, and more. Compare
        prices and shop smarter with us.
      </p>

      <div className="mt-6">
        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
        >
          Explore Products
        </Link>
      </div>
    </motion.div>
  );
}
