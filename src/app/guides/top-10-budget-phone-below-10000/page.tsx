import type { Metadata } from "next";
import BudgetPhonesSection from "@/components/BudgetPhonesSection";

export const metadata: Metadata = {
  title: "Top 10 Budget Gaming Phones Under ₱10,000 – DealWise",
  description:
    "Compare the best budget gaming smartphones under ₱10,000. Check Antutu scores, camera quality, battery life, and price offers from trusted platforms.",
};

async function fetchGamingPhones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/phones?category=gaming-phones&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function BudgetPhonesPage() {
  const gamingPhones = await fetchGamingPhones();
  return <BudgetPhonesSection products={gamingPhones} />;
}
