"use client";

import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifiedBadge() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-green-200 px-6 py-4 rounded-2xl shadow-lg max-w-2xl mx-auto hover:shadow-xl transition-shadow duration-300">
      {/* Left side: main message with icon */}
      <div className="flex items-center gap-3 text-gray-800">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BadgeCheck className="h-7 w-7 text-green-600" />
        </motion.div>
        <p className="text-sm sm:text-base font-semibold leading-snug">
          All links are 100% legit and sourced directly from official platforms.
        </p>
      </div>

      {/* Right side: verification badge */}
      <span className="inline-flex items-center text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-900 px-5 py-2 rounded-full shadow-md text-center">
        Verified & Secure
      </span>
    </div>
  );
}
