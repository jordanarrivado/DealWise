"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import axios from "axios";
import Swal from "sweetalert2";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface Product {
  _id: string;
  title: string;
  category?: string;
  image: string;
  offers: Offer[];
  desc?: string[];
}

type SortOption = "priceLow" | "rating";

export default function Product() {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>("/api/products");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/products?id=${id}`);
          setItems((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "The product has been removed.", "success");
        } catch (err) {
          console.error("Failed to delete product:", err);
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  // ✅ Categories
  const categories = useMemo(() => {
    const cats = items.map((p) => p.category).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [items]);

  // ✅ Filter + sort
  const filteredAndSortedProducts = useMemo(() => {
    return (items || [])
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
  }, [items, searchQuery, sortBy, categoryFilter]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        🛠 Manage Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 border rounded-lg shadow-sm"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white dark:bg-gray-900"
            >
              {/* Image & Info */}
              <div className="flex flex-col items-center">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">
                  {product.title}
                </h3>
                {product.category && (
                  <span className="text-xs text-gray-500">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Offers Summary */}
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {product.offers.length} offers • Min ₱
                {product.minPrice?.toLocaleString()}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
