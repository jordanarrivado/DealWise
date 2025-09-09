"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import clsx from "clsx";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface Pencil {
  _id: string;
  title: string;
  hardness: string;
  material: string;
  shape: string;
  color: string;
  erasable: string;
  image?: string;
  offers: Offer[];
}

type SortOption = "priceLow" | "rating" | "hardness";
interface PencilRankingProps {
  title: string;
  products: Pencil[];
}

export default function PencilRanking({ title, products }: PencilRankingProps) {
  const [pencils, setPencils] = useState<Pencil[]>(products || []);
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPencils = async () => {
      try {
        const res = await axios.get<Pencil[]>("/api/pencils");
        setPencils(res.data);
      } catch (err) {
        console.error("Failed to fetch pencils:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPencils();
  }, []);

  const sortedPencils = [...pencils].sort((a, b) => {
    if (sortBy === "priceLow") {
      const aMin = Math.min(...a.offers.map((o) => o.price));
      const bMin = Math.min(...b.offers.map((o) => o.price));
      return aMin - bMin;
    }
    if (sortBy === "rating") {
      const aMax = Math.max(...a.offers.map((o) => o.rating));
      const bMax = Math.max(...b.offers.map((o) => o.rating));
      return bMax - aMax;
    }
    if (sortBy === "hardness") {
      // simple alphabetical hardness sort
      return a.hardness.localeCompare(b.hardness);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading pencils...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Best Pencils for Artist
      </h2>

      {/* Sort Controls */}
      <div className="flex flex-wrap justify-center mb-6 gap-3">
        <button
          onClick={() => setSortBy("priceLow")}
          className={`px-4 py-2 rounded-lg ${
            sortBy === "priceLow" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          💰 Price: Low to High
        </button>
        <button
          onClick={() => setSortBy("rating")}
          className={`px-4 py-2 rounded-lg ${
            sortBy === "rating" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ⭐ Highest Rating
        </button>
        <button
          onClick={() => setSortBy("hardness")}
          className={`px-4 py-2 rounded-lg ${
            sortBy === "hardness" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ✏️ Hardness
        </button>
      </div>

      {/* Table (desktop) */}
      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse rounded-xl overflow-hidden shadow-lg mt-5">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-center text-xs sm:text-sm md:text-base font-semibold text-white uppercase tracking-wide">
              <th className="p-2 sm:p-3 w-[5%]">Rank</th>
              <th className="p-2 sm:p-3 w-[20%]">Pencil</th>
              <th className="p-2 sm:p-3 w-[30%]">Specs</th>
              <th className="p-2 sm:p-3 w-[30%]">Offers</th>
            </tr>
          </thead>
          <tbody>
            {sortedPencils.map((pencil, index) => (
              <motion.tr
                key={pencil._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm"
              >
                <td className="p-2 sm:p-3 font-bold text-center">
                  #{index + 1}
                </td>

                <td className="p-2 sm:p-3">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={pencil.image || "/placeholder.png"}
                      alt={pencil.title}
                      width={180}
                      height={180}
                      className="w-full max-w-[120px] sm:max-w-[180px] object-cover rounded-lg"
                    />
                    <span className="text-center text-[11px] sm:text-sm font-medium break-words">
                      {pencil.title}
                    </span>
                  </div>
                </td>

                <td className="p-2 sm:p-3 text-center text-gray-700 dark:text-gray-300 break-words">
                  ✏️ {pencil.hardness} • {pencil.material} • {pencil.shape} •{" "}
                  {pencil.color} • Erasable: {pencil.erasable}
                </td>

                <td className="p-2 sm:p-3">
                  <div className="space-y-2">
                    {pencil.offers.map((offer, i) => {
                      const minPrice = Math.min(
                        ...pencil.offers.map((o) => o.price)
                      );
                      const maxRating = Math.max(
                        ...pencil.offers.map((o) => o.rating)
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
                            <Link
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 sm:px-5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[10px] sm:text-xs font-semibold shadow hover:shadow-lg transition"
                            >
                              Go
                            </Link>
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedPencils.map((pencil, index) => (
          <motion.div
            key={pencil._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src={pencil.image || "/placeholder.png"}
                alt={pencil.title}
                width={70}
                height={70}
                className="rounded-lg"
              />
              <div>
                <p className="font-bold text-sm">
                  #{index + 1} {pencil.title}
                </p>
                <p className="text-xs text-gray-500">{pencil.hardness}</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 mt-2">
              {pencil.material} • {pencil.shape} • {pencil.color} • Erasable:{" "}
              {pencil.erasable}
            </p>

            <div className="space-y-2 mt-2">
              {pencil.offers.map((offer, i) => {
                const minPrice = Math.min(...pencil.offers.map((o) => o.price));
                const maxRating = Math.max(
                  ...pencil.offers.map((o) => o.rating)
                );
                const isBestDeal = offer.price === minPrice;
                const isTopRated = offer.rating === maxRating;

                return (
                  <div
                    key={i}
                    className={clsx(
                      "p-2 rounded-lg shadow-sm text-xs flex justify-between items-center",
                      isBestDeal
                        ? "bg-green-100 ring-2 ring-green-400"
                        : "bg-gray-100"
                    )}
                  >
                    <span>{offer.merchant}</span>
                    <span
                      className={isBestDeal ? "text-green-700 font-bold" : ""}
                    >
                      ₱{offer.price.toLocaleString()}
                    </span>
                    <span
                      className={isTopRated ? "text-yellow-600 font-bold" : ""}
                    >
                      ⭐ {offer.rating}
                    </span>
                    <Link
                      href={offer.url}
                      target="_blank"
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Go
                    </Link>
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
