"use client";

import Link from "next/link";
import clsx from "clsx";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface OfferCardProps {
  offer: Offer;
  isBestDeal: boolean;
  isTopRated: boolean;
}

export default function OfferCard({
  offer,
  isBestDeal,
  isTopRated,
}: OfferCardProps) {
  return (
    <div
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
        <span className="font-medium truncate">{offer.merchant}</span>
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
}
