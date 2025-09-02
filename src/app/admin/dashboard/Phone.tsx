"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface Phone {
  _id: string;
  name: string;
  image: string;
  chipset: string;
  gamingScore: number;
  antutu: number;
  camera: string;
  battery: string;
  display: string;
  offers: Offer[];
}

type SortOption = "priceLow" | "rating";

export default function Phones() {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch phones
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const { data } = await axios.get<Phone[]>("/api/phones");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch phones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhones();
  }, []);

  // ✅ Delete handler (fixed endpoint)
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This phone will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/phones?id=${id}`);
          setItems((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "The phone has been removed.", "success");
        } catch (err) {
          console.error("Failed to delete phone:", err);
          Swal.fire("Error", "Failed to delete phone", "error");
        }
      }
    });
  };

  // ✅ Filter + sort
  const filteredAndSortedPhones = useMemo(() => {
    return (items || [])
      .filter((phone) =>
        phone.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .map((phone) => ({
        ...phone,
        minPrice: phone.offers.length
          ? Math.min(...phone.offers.map((o) => o.price))
          : 0,
        maxRating: phone.offers.length
          ? Math.max(...phone.offers.map((o) => o.rating))
          : 0,
      }))
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.minPrice - b.minPrice;
        if (sortBy === "rating") return b.maxRating - a.maxRating;
        return 0;
      });
  }, [items, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading phones...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        📱 Manage Phones
      </h2>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search phones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
      </div>

      {/* Phones Grid */}
      {filteredAndSortedPhones.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No phones found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPhones.map((phone) => (
            <motion.div
              key={phone._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white dark:bg-gray-900"
            >
              {/* Image & Info */}
              <div className="flex flex-col items-center">
                <Image
                  src={phone.image || "/placeholder.png"}
                  alt={phone.name}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">{phone.name}</h3>
                <span className="text-xs text-gray-500">{phone.chipset}</span>
              </div>

              {/* Offers Summary */}
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {phone.offers.length} offers • Min ₱
                {phone.minPrice?.toLocaleString()}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleDelete(phone._id)}
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
