"use client";

import { useState } from "react";
import Product from "./Product";
import Phone from "./Phone";
import Laptop from "./Laptop";
import SketchPad from "./SketchPad";
import Pencils from "./Pencil";
import Headphones from "./Headphone";
import { useProductCounts } from "../../../hooks/useProductCounts";

type ItemKey =
  | "phones"
  | "laptops"
  | "products"
  | "sketchpad"
  | "pencil"
  | "headphones";

export default function Items() {
  const [activeItem, setActiveItem] = useState<ItemKey>("phones");

  const { counts } = useProductCounts();

  const buttons: { key: ItemKey; label: string; count: number }[] = [
    { key: "phones", label: "📱 Phones", count: counts.phones },
    { key: "laptops", label: "💻 Laptops", count: counts.laptop },
    { key: "headphones", label: "🎧 Headphones", count: counts.headphones },
    { key: "products", label: "📦 Products", count: counts.products },
    { key: "sketchpad", label: "📓 Sketchpad", count: counts.sketchPad },
    { key: "pencil", label: "✏️ Pencils", count: counts.pencil },
  ];

  return (
    <div className="p-4">
      {/* Toggle buttons */}
      <div className="flex gap-3 mb-4 overflow-x-auto whitespace-nowrap px-1">
        {buttons.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveItem(item.key)}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
              activeItem === item.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            {item.label}{" "}
            <span className="text-red-500 font-bold ml-1">{item.count}</span>
          </button>
        ))}
      </div>

      {/* Content switch */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {activeItem === "phones" && <Phone />}
        {activeItem === "products" && <Product />}
        {activeItem === "laptops" && <Laptop />}
        {activeItem === "sketchpad" && <SketchPad />}
        {activeItem === "pencil" && <Pencils />}
        {activeItem === "headphones" && <Headphones />}
      </div>
    </div>
  );
}
