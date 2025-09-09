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

interface Headphone {
  _id: string;
  name: string;
  image: string;
  type: string;
  connectivity: string;
  batteryLife?: string;
  offers: Offer[];
}

interface HeadphoneRankingProps {
  title: string;
  products: Headphone[];
}

type SortOption = "priceLow" | "rating";

export default function HeadphoneRanking({ title }: HeadphoneRankingProps) {
  const [headphones, setHeadphones] = useState<Headphone[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeadphones = async () => {
      try {
        const res = await axios.get<Headphone[]>("/api/headphone");
        setHeadphones(res.data);
      } catch (err) {
        console.error("Failed to fetch headphones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeadphones();
  }, []);

  const handleTrackClick = async (headphoneName: string, offer: Offer) => {
    try {
      await axios.post("/api/trackClick", {
        headphoneName,
        merchant: offer.merchant,
        url: offer.url,
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }
  };

  const sortedHeadphones = [...headphones].sort((a, b) => {
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
    return 0;
  });

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading headphones...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">{title} 🎧</h2>

      {/* Sort Buttons */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-3">
        <button
          onClick={() => setSortBy("priceLow")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "priceLow" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          💰 Price: Low to High
        </button>
        <button
          onClick={() => setSortBy("rating")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "rating" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ⭐ Highest Rating
        </button>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-[700px] w-full border-collapse rounded-xl overflow-hidden shadow-lg mt-5">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">
              <th className="p-2 sm:p-3 w-[5%]">Rank</th>
              <th className="p-2 sm:p-3 w-[20%]">Headphone</th>
              <th className="p-2 sm:p-3 w-[25%]">Specs</th>
              <th className="p-2 sm:p-3 w-[50%]">Offers</th>
            </tr>
          </thead>
          <tbody>
            {sortedHeadphones.map((hp, index) => (
              <motion.tr
                key={hp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm"
              >
                <td className="p-2 sm:p-3 font-bold">#{index + 1}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={hp.image || "/placeholder.png"}
                      alt={hp.name}
                      width={120}
                      height={120}
                      className="rounded-lg"
                    />
                    <span className="text-center font-medium break-words">
                      {hp.name}
                    </span>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-center text-gray-700 dark:text-gray-300">
                  🎧 {hp.type} <br />
                  🔌 {hp.connectivity} <br />
                  {hp.batteryLife && <>🔋 {hp.batteryLife}</>}
                </td>
                <td className="p-2 sm:p-3">
                  <div className="space-y-2">
                    {hp.offers.map((offer, i) => {
                      const minPrice = Math.min(
                        ...hp.offers.map((o) => o.price)
                      );
                      const maxRating = Math.max(
                        ...hp.offers.map((o) => o.rating)
                      );
                      const isBestDeal = offer.price === minPrice;
                      const isTopRated = offer.rating === maxRating;

                      return (
                        <div
                          key={i}
                          className={clsx(
                            "relative grid grid-rows-[auto_auto] gap-1 p-2 rounded-xl shadow-md text-xs",
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
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                              {offer.reviews} review
                              {offer.reviews !== 1 ? "s" : ""}
                            </span>
                            <Link
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleTrackClick(hp.name, offer)}
                              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[10px] font-semibold shadow hover:shadow-lg transition"
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
        {sortedHeadphones.map((hp, index) => (
          <motion.div
            key={hp._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={hp.image || "/placeholder.png"}
                alt={hp.name}
                width={70}
                height={70}
                className="rounded-lg"
              />
              <div>
                <p className="font-bold text-sm">
                  #{index + 1} {hp.name}
                </p>
                <p className="text-xs text-gray-500">
                  🎧 {hp.type} • 🔌 {hp.connectivity}{" "}
                  {hp.batteryLife && `• 🔋 ${hp.batteryLife}`}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {hp.offers.map((offer, i) => {
                const minPrice = Math.min(...hp.offers.map((o) => o.price));
                const maxRating = Math.max(...hp.offers.map((o) => o.rating));
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
                        onClick={() => handleTrackClick(hp.name, offer)}
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
