"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface SketchPad {
  _id: string;
  title: string;
  size: string;
  pageCount: number;
  paperGSM: number;
  binding: string;
  type: string;
  image?: string;
  offers: Offer[];
}

interface SketchPadRankingProps {
  title: string;
  products: SketchPad[];
}

type SortOption = "pageCount" | "paperGSM" | "offers";

export default function SketchPadRanking({
  title,
  products,
}: SketchPadRankingProps) {
  const [sortBy, setSortBy] = useState<SortOption>("offers");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "pageCount") return b.pageCount - a.pageCount;
    if (sortBy === "paperGSM") return b.paperGSM - a.paperGSM;
    if (sortBy === "offers") return b.offers.length - a.offers.length;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">{title}</h2>

      {/* Sort Buttons */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setSortBy("offers")}
          className={clsx(
            "px-4 py-2 rounded-lg",
            sortBy === "offers" ? "bg-blue-600 text-white" : "bg-gray-200"
          )}
        >
          🛒 Most Offers
        </button>
        <button
          onClick={() => setSortBy("pageCount")}
          className={clsx(
            "px-4 py-2 rounded-lg",
            sortBy === "pageCount" ? "bg-blue-600 text-white" : "bg-gray-200"
          )}
        >
          📄 Pages
        </button>
        <button
          onClick={() => setSortBy("paperGSM")}
          className={clsx(
            "px-4 py-2 rounded-lg",
            sortBy === "paperGSM" ? "bg-blue-600 text-white" : "bg-gray-200"
          )}
        >
          📝 Paper GSM
        </button>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-[800px] w-full table-auto border-collapse rounded-xl shadow-lg mt-5">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white uppercase text-sm font-semibold ">
              <th className="p-2 text-center">#</th>
              <th className="p-2 text-center w-[30%]">SketchPad</th>
              <th className="p-2 text-center w-[36%]">Specs</th>
              <th className="p-2 text-center w-[30%]">Offers</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((pad, idx) => (
              <motion.tr
                key={pad._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-sm align-top"
              >
                <td className="p-2 font-bold align-middle">#{idx + 1}</td>
                <td className="p-2 flex flex-col items-center text-center">
                  {pad.image && (
                    <Image
                      src={pad.image}
                      alt={pad.title}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover mb-2"
                    />
                  )}
                  <span>{pad.title}</span>
                </td>

                <td className="p-2 text-center align-middle">
                  {pad.type} • {pad.size} • {pad.pageCount} pages •{" "}
                  {pad.paperGSM} GSM • {pad.binding}
                </td>
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-2">
                    {pad.offers.map((offer, i) => {
                      const minPrice = Math.min(
                        ...pad.offers.map((o) => o.price)
                      );
                      const maxRating = Math.max(
                        ...pad.offers.map((o) => o.rating)
                      );
                      const isBestDeal = offer.price === minPrice;
                      const isTopRated = offer.rating === maxRating;

                      return (
                        <div
                          key={i}
                          className={clsx(
                            "grid grid-cols-[1fr_auto_auto] items-center gap-2 p-2 rounded-lg shadow",
                            isBestDeal
                              ? "bg-green-100 ring-2 ring-green-400"
                              : "bg-white"
                          )}
                        >
                          {isBestDeal && (
                            <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full">
                              BEST DEAL
                            </span>
                          )}
                          <span className="font-medium truncate">
                            {offer.merchant}
                          </span>
                          <span className="font-bold text-green-700">
                            ₱{offer.price.toLocaleString()} {isBestDeal && "🏆"}
                          </span>
                          <span className="font-semibold text-yellow-600">
                            ⭐ {offer.rating} {isTopRated && "🏅"}
                          </span>
                          <div className="col-span-3 flex justify-between mt-1">
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] px-2 py-0.5 rounded-full">
                              {offer.reviews} review
                              {offer.reviews !== 1 ? "s" : ""}
                            </span>
                            <Link
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-semibold"
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedProducts.map((pad, idx) => (
          <motion.div
            key={pad._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              {pad.image && (
                <Image
                  src={pad.image}
                  alt={pad.title}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              )}
              <div>
                <p className="font-bold text-sm">
                  #{idx + 1} {pad.title}
                </p>
                <p className="text-xs text-gray-500">
                  {pad.type} • {pad.size}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-300">
              Pages: {pad.pageCount} • GSM: {pad.paperGSM} • Binding:{" "}
              {pad.binding}
            </div>

            <div className="space-y-2">
              {pad.offers.map((offer, i) => {
                const minPrice = Math.min(...pad.offers.map((o) => o.price));
                const maxRating = Math.max(...pad.offers.map((o) => o.rating));
                const isBestDeal = offer.price === minPrice;
                const isTopRated = offer.rating === maxRating;

                return (
                  <div
                    key={i}
                    className={clsx(
                      "grid grid-rows-[auto_auto] gap-1 p-2 rounded-lg shadow text-xs",
                      isBestDeal
                        ? "bg-green-100 ring-2 ring-green-400"
                        : "bg-white/70 dark:bg-gray-800/60"
                    )}
                  >
                    {isBestDeal && (
                      <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full">
                        BEST DEAL
                      </span>
                    )}
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                      <span className="font-medium truncate">
                        {offer.merchant}
                      </span>
                      <span className="font-bold text-green-700">
                        ₱{offer.price.toLocaleString()} {isBestDeal && "🏆"}
                      </span>
                      <span className="font-semibold text-yellow-600">
                        ⭐ {offer.rating} {isTopRated && "🏅"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] px-2 py-0.5 rounded-full">
                        {offer.reviews} review{offer.reviews !== 1 ? "s" : ""}
                      </span>
                      <Link
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-semibold"
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
