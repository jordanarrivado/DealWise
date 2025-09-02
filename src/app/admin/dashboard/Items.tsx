"use client";

import { useState } from "react";
import Product from "./Product";
import Phone from "./Phone";

export default function Items() {
  const [activeItem, setActiveItem] = useState<"phones" | "products">("phones");

  return (
    <div className="p-4">
      {/* Toggle buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveItem("phones")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeItem === "phones"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          📱 Phones
        </button>
        <button
          onClick={() => setActiveItem("products")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeItem === "products"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          📦 Products
        </button>
      </div>

      {/* Content switch */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {activeItem === "phones" && <Phone />}
        {activeItem === "products" && <Product />}
      </div>
    </div>
  );
}
