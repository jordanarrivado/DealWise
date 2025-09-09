"use client";

import { useState } from "react";
import BudgetPhonesSection from "@/components/BudgetPhonesSection";
import LaptopRanking from "../guides/top-budget-laptop/LaptopRanking";
import PencilRanking from "../guides/best-budget-pencil/PencilRanking";
import SketchPadRanking from "../guides/best-budget-sketchpad/SketchPadRanking";
import HeadphoneRanking from "../guides/budget-quality-headphone/HeadphoneRanking";
import BadgeCheck from "@/components/BadgeCheck";
import AdBanner from "@/components/AdBanner";
import { Headphone } from "./types/headphone";
import { Laptop } from "./types/laptop";
import { Phone } from "./types/phone";
import { Pencil } from "./types/pencil";
import { SketchPad } from "./types/sketchpad";

export default function DealsClient({
  gamingPhones,
  budgetLaptops,
  affordableHeadphones,
  topPencils,
  topSketchPads,
}: {
  gamingPhones: Phone[];
  budgetLaptops: Laptop[];
  affordableHeadphones: Headphone[];
  topPencils: Pencil[];
  topSketchPads: SketchPad[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("phones");

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <AdBanner />
      <BadgeCheck />

      {/* Sorting Dropdown */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="phones">Phones</option>
          <option value="laptops">Laptops</option>
          <option value="headphones">Headphones</option>
          <option value="pencils">Pencils</option>
          <option value="sketchpads">SketchPads</option>
        </select>
      </div>

      {/* Conditional Rendering */}
      {selectedCategory === "phones" && gamingPhones.length > 0 && (
        <BudgetPhonesSection products={gamingPhones} />
      )}

      {selectedCategory === "laptops" && budgetLaptops.length > 0 && (
        <LaptopRanking
          title="Top 10 Budget Laptops Under ₱20,000"
          products={budgetLaptops}
        />
      )}

      {selectedCategory === "pencils" && topPencils.length > 0 && (
        <PencilRanking
          title="Top 10 Pencils for Artists"
          products={topPencils}
        />
      )}

      {selectedCategory === "headphones" && affordableHeadphones.length > 0 && (
        <HeadphoneRanking
          title="Affordable Headphones"
          products={affordableHeadphones}
        />
      )}

      {selectedCategory === "sketchpads" && topSketchPads.length > 0 && (
        <SketchPadRanking
          title="Best SketchPads for Artists"
          products={topSketchPads}
        />
      )}
    </div>
  );
}
