"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import clsx from "clsx";

interface PlatformOffer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface Phone {
  name: string;
  gamingScore: number;
  antutu: number;
  camera: string;
  battery: string;
  display: string;
  chipset: string;
  image: string;
  offers: PlatformOffer[];
}

type SortOption = "gaming" | "priceLow" | "camera" | "antutu";

interface BudgetPhonesProps {
  title: string;
  products: any[];
}

export default function BudgetPhonesRanking({
  title,
  products,
}: BudgetPhonesProps) {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("gaming");
  const [loading, setLoading] = useState(true);

  // Fetch phones from API
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await axios.get("/api/phones");
        setPhones(response.data); // API should return array of phones
      } catch (err) {
        console.error("Failed to fetch phones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhones();
  }, []);

  const handleTrackClick = async (phoneName: string, offer: PlatformOffer) => {
    try {
      await axios.post("/api/trackClick", {
        phoneName,
        merchant: offer.merchant,
        url: offer.url,
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }
  };

  const sortedPhones = [...phones].sort((a, b) => {
    if (sortBy === "gaming") return b.gamingScore - a.gamingScore;
    if (sortBy === "priceLow") {
      const aMin = Math.min(...a.offers.map((o) => o.price));
      const bMin = Math.min(...b.offers.map((o) => o.price));
      return aMin - bMin;
    }
    if (sortBy === "camera") {
      const getMP = (cam: string) => {
        const match = cam.match(/(\d+)\s*MP/i);
        return match ? parseInt(match[1]) : 0;
      };
      return getMP(b.camera) - getMP(a.camera);
    }

    if (sortBy === "antutu") return b.antutu - a.antutu;
    return 0;
  });

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Loading phones...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        📱 Top Budget Phones under ₱10,000
      </h2>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-3">
        <button
          onClick={() => setSortBy("gaming")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "gaming" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          🎮 Best Gaming
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
          onClick={() => setSortBy("camera")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "camera" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📸 Best Camera
        </button>

        <button
          onClick={() => setSortBy("antutu")}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
            sortBy === "antutu" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ⚡ Antutu Score
        </button>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-[700px] w-full border-collapse rounded-xl overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-center text-xs sm:text-sm md:text-base font-semibold text-white uppercase tracking-wide">
              <th className="p-2 sm:p-3 w-[5%]">Rank</th>
              <th className="p-2 sm:p-3 w-[20%]">Phone</th>
              <th className="p-2 sm:p-3 w-[30%]">Specs</th>
              <th className="p-2 sm:p-3 w-[15%]">Antutu</th>
              <th className="p-2 sm:p-3 w-[30%]">Offers</th>
            </tr>
          </thead>
          <tbody>
            {sortedPhones.map((phone, index) => (
              <motion.tr
                key={phone.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm"
              >
                <td className="p-2 sm:p-3 font-bold">#{index + 1}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={
                        phone.image && phone.image.trim() !== ""
                          ? phone.image
                          : "/placeholder.png"
                      }
                      alt={phone.name}
                      width={180}
                      height={180}
                      className="w-full max-w-[120px] sm:max-w-[180px] object-cover rounded-lg"
                    />
                    <span className="text-center text-[11px] sm:text-sm font-medium break-words">
                      {phone.name}
                    </span>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-center text-gray-700 dark:text-gray-300 break-words">
                  📸 {phone.camera} • 📱 {phone.display} • ⚡ {phone.chipset} •
                  🔋 {phone.battery}
                </td>
                <td className="p-2 sm:p-3 text-center">
                  {phone.antutu.toLocaleString()}
                </td>
                <td className="p-2 sm:p-3">
                  <td className="p-2 sm:p-3">
                    <div className="space-y-2">
                      {phone.offers.map((offer, i) => {
                        const minPrice = Math.min(
                          ...phone.offers.map((o) => o.price)
                        );
                        const maxRating = Math.max(
                          ...phone.offers.map((o) => o.rating)
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
                            {/* BEST DEAL Badge */}
                            {isBestDeal && (
                              <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                BEST DEAL
                              </span>
                            )}

                            {/* Top row */}
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

                            {/* Bottom row */}
                            <div className="flex justify-between items-center mt-1">
                              <span className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                                {offer.reviews} review
                                {offer.reviews !== 1 ? "s" : ""}
                              </span>

                              <a
                                href={offer.url}
                                onClick={() =>
                                  handleTrackClick(phone.name, offer)
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
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedPhones.map((phone, index) => (
          <motion.div
            key={phone.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3"
          >
            {/* Header: Rank + Name + Antutu */}
            <div className="flex items-center gap-3">
              <Image
                src={phone.image}
                alt={phone.name}
                width={70}
                height={70}
                className="rounded-lg"
              />
              <div>
                <p className="font-bold text-sm">
                  #{index + 1} {phone.name}
                </p>
                <p className="text-xs text-gray-500">
                  ⚡ Antutu: {phone.antutu.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              📸 {phone.camera} <br />
              📱 {phone.display} <br />⚡ {phone.chipset} <br />
              🔋 {phone.battery}
            </div>

            {/* Offers */}
            <div className="space-y-2">
              {phone.offers.map((offer, i) => {
                const minPrice = Math.min(...phone.offers.map((o) => o.price));
                const maxRating = Math.max(
                  ...phone.offers.map((o) => o.rating)
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

                    {/* Merchant / Price / Rating */}
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

                    {/* Reviews + Link */}
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
