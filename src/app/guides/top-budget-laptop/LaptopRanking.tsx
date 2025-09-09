"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import clsx from "clsx";
import { PlatformOffer } from "@/types/Platform";
import { Laptop } from "@/types/laptop";

interface LaptopRankingProps {
  title: string;
  products: Laptop[];
}

type SortOption = "performance" | "priceLow" | "ram" | "storage";

export default function LaptopRanking({ title }: LaptopRankingProps) {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("performance");
  const [loading, setLoading] = useState(true);

  // Fetch laptops from API
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await axios.get<Laptop[]>("/api/laptops");
        setLaptops(response.data);
      } catch (err) {
        console.error("Failed to fetch laptops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  const handleTrackClick = async (laptopName: string, offer: PlatformOffer) => {
    try {
      await axios.post("/api/trackClick", {
        laptopName,
        merchant: offer.merchant,
        url: offer.url,
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }
  };

  // Sorting logic
  function extractNumber(value: string): number {
    const match = value.match(/\d+/); // find first number
    return match ? parseInt(match[0], 10) : 0;
  }

  const sortedLaptops = [...laptops].sort((a, b) => {
    if (sortBy === "performance")
      return b.performanceScore - a.performanceScore;
    if (sortBy === "priceLow") {
      const aMin = Math.min(...a.offers.map((o) => o.price));
      const bMin = Math.min(...b.offers.map((o) => o.price));
      return aMin - bMin;
    }
    if (sortBy === "ram") return b.ram - a.ram;
    if (sortBy === "storage")
      return extractNumber(b.storage) - extractNumber(a.storage);
    return 0;
  });

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Loading laptops...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        💻 Top Budget Laptops in 2025
      </h2>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-3">
        <button
          onClick={() => setSortBy("performance")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "performance" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ⚡ Best Performance
        </button>

        <button
          onClick={() => setSortBy("priceLow")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "priceLow" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          💰 Price: Low to High
        </button>

        <button
          onClick={() => setSortBy("ram")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "ram" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          🧠 RAM
        </button>

        <button
          onClick={() => setSortBy("storage")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "storage" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          💾 Storage
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-[700px] w-full border-collapse rounded-xl overflow-hidden shadow-lg mt-5">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-center text-xs sm:text-sm md:text-base font-semibold text-white uppercase tracking-wide">
              <th className="p-2 sm:p-3 w-[5%]">Rank</th>
              <th className="p-2 sm:p-3 w-[20%]">Laptop</th>
              <th className="p-2 sm:p-3 w-[30%]">Specs</th>
              <th className="p-2 sm:p-3 w-[15%]">Score</th>
              <th className="p-2 sm:p-3 w-[30%]">Offers</th>
            </tr>
          </thead>
          <tbody>
            {sortedLaptops.map((laptop, index) => (
              <motion.tr
                key={laptop.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm"
              >
                <td className="p-2 sm:p-3 font-bold">#{index + 1}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={laptop.image || "/placeholder.png"}
                      alt={laptop.name}
                      width={180}
                      height={180}
                      className="w-full max-w-[120px] sm:max-w-[180px] object-cover rounded-lg"
                    />
                    <span className="text-center text-[11px] sm:text-sm font-medium break-words">
                      {laptop.name}
                    </span>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-center text-gray-700 dark:text-gray-300 break-words">
                  🧠 {laptop.processor} • 💾 {laptop.ram} • 💽 {laptop.storage}{" "}
                  • 🖥️ {laptop.display}
                </td>
                <td className="p-2 sm:p-3 text-center">
                  ⚡{laptop.performanceScore}
                </td>
                <td className="p-2 sm:p-3">
                  <div className="space-y-2">
                    {laptop.offers.map((offer, i) => {
                      const minPrice = Math.min(
                        ...laptop.offers.map((o) => o.price)
                      );
                      const maxRating = Math.max(
                        ...laptop.offers.map((o) => o.rating)
                      );
                      const isBestDeal = offer.price === minPrice;
                      const isTopRated = offer.rating === maxRating;

                      return (
                        <div
                          key={i}
                          className={clsx(
                            "relative grid grid-rows-[auto_auto] gap-1 p-2 sm:p-3 rounded-xl shadow-md transition-all text-xs sm:text-sm w-[40vh]",
                            isBestDeal
                              ? "bg-green-100/70 dark:bg-green-700/50 ring-2 ring-green-400"
                              : "bg-white/70 dark:bg-gray-800/60"
                          )}
                        >
                          {isBestDeal && (
                            <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                              BEST DEAL
                            </span>
                          )}
                          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                            <span className="font-medium truncate">
                              {offer.merchant}
                            </span>
                            <span
                              className={clsx(
                                "font-bold",
                                isBestDeal
                                  ? "text-green-700 dark:text-green-200"
                                  : "text-gray-900 dark:text-gray-100"
                              )}
                            >
                              ₱{offer.price.toLocaleString()}{" "}
                              {isBestDeal && "🏆"}
                            </span>
                            <span
                              className={clsx(
                                "font-semibold",
                                isTopRated
                                  ? "text-yellow-600 dark:text-yellow-300"
                                  : "text-gray-500"
                              )}
                            >
                              ⭐ {offer.rating} {isTopRated && "🏅"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                              {offer.reviews} review
                              {offer.reviews !== 1 ? "s" : ""}
                            </span>
                            <a
                              href={offer.url}
                              onClick={() =>
                                handleTrackClick(laptop.name, offer)
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 sm:px-5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[10px] sm:text-xs font-semibold shadow hover:shadow-lg transition"
                            >
                              Go
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedLaptops.map((laptop, index) => (
          <motion.div
            key={laptop.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={laptop.image || "/placeholder.png"}
                alt={laptop.name}
                width={70}
                height={70}
                className="rounded-lg"
              />
              <div>
                <p className="font-bold text-sm">
                  #{index + 1} {laptop.name}
                </p>
                <p className="text-xs text-gray-500">
                  ⚡ Score: {laptop.performanceScore}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              🧠 {laptop.processor} <br />
              💾 {laptop.ram} <br />
              💽 {laptop.storage} <br />
              🖥️ {laptop.display}
            </div>

            <div className="space-y-2">
              {laptop.offers.map((offer, i) => {
                const minPrice = Math.min(...laptop.offers.map((o) => o.price));
                const maxRating = Math.max(
                  ...laptop.offers.map((o) => o.rating)
                );
                const isBestDeal = offer.price === minPrice;
                const isTopRated = offer.rating === maxRating;

                return (
                  <div
                    key={i}
                    className={clsx(
                      "relative grid grid-rows-[auto_auto] gap-1 p-2 rounded-lg shadow-md text-xs",
                      isBestDeal
                        ? "bg-green-100/70 dark:bg-green-700/50 ring-2 ring-green-400"
                        : "bg-white/70 dark:bg-gray-800/60"
                    )}
                  >
                    {isBestDeal && (
                      <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                        BEST DEAL
                      </span>
                    )}
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                      <span className="font-medium truncate">
                        {offer.merchant}
                      </span>
                      <span
                        className={clsx(
                          "font-bold",
                          isBestDeal
                            ? "text-green-700 dark:text-green-200"
                            : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        ₱{offer.price.toLocaleString()} {isBestDeal && "🏆"}
                      </span>
                      <span
                        className={clsx(
                          "font-semibold",
                          isTopRated
                            ? "text-yellow-600 dark:text-yellow-300"
                            : "text-gray-500"
                        )}
                      >
                        ⭐ {offer.rating} {isTopRated && "🏅"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        {offer.reviews} review{offer.reviews !== 1 ? "s" : ""}
                      </span>
                      <Link
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[10px] font-semibold shadow hover:shadow-lg transition"
                      >
                        Go
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
