import LaptopRanking from "../top-budget-laptop/LaptopRanking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 10 Budget Laptops Under ₱20,000 – DealWise",
  description:
    "Discover the best budget laptops under ₱20,000 in the Philippines. Compare processors, RAM, storage, display, and get the best offers from trusted platforms.",
};

async function fetchBudgetLaptops() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/laptops?category=budget-laptops&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function BudgetLaptopsPage() {
  const budgetLaptops = await fetchBudgetLaptops();
  return (
    <LaptopRanking
      title="Top 10 Budget Laptops Under ₱20,000"
      products={budgetLaptops}
    />
  );
}
