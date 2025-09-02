// app/page.tsx
import HeroSection from "@/components/HeroSection";
import { ShoppingBag, Search, BadgeDollarSign } from "lucide-react";
import BudgetPhonesSection from "@/components/BudgetPhonesSection";

type Metadata = {
  title?: string;
  description?: string;
};

export const metadata: Metadata = {
  title: "DealWise – Smart Shopping for Budget Phones, Laptops & Tech Deals",
  description:
    "DealWise helps you find the best prices on smartphones, laptops, and accessories from Shopee, TikTok Shop, Amazon, and more. Compare verified deals, save money, and shop smarter.",
};

// Server-side fetch functions
async function fetchGamingPhones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/phones?category=gaming-phones&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

async function fetchBudgetLaptops() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?category=budget-laptops&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

async function fetchAffordableHeadphones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?category=affordable-headphones&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function HomePage() {
  // Fetch all data server-side for SEO
  const [gamingPhones, budgetLaptops, affordableHeadphones] = await Promise.all(
    [fetchGamingPhones(), fetchBudgetLaptops(), fetchAffordableHeadphones()]
  );

  return (
    <div className="text-center space-y-10 sm:space-y-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section (client component) */}
      <HeroSection />

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <ShoppingBag className="w-10 h-10 text-blue-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Wide Selection</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Find the best deals from multiple platforms in one place.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <Search className="w-10 h-10 text-purple-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Smart Search</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Quickly search across platforms and categories with ease.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <BadgeDollarSign className="w-10 h-10 text-green-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Best Prices</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Compare and ensure you’re getting the most value for your money.
          </p>
        </div>
      </div>

      {/* Top Products Sections */}
      {gamingPhones.length > 0 && (
        <BudgetPhonesSection products={gamingPhones} />
      )}
    </div>
  );
}
