// app/page.tsx
import HeroSection from "@/components/HeroSection";
import { ShoppingBag, Search, BadgeDollarSign } from "lucide-react";
import BudgetPhonesSection from "@/components/BudgetPhonesSection";
import LaptopRanking from "./guides/top-budget-laptop/LaptopRanking";
import AdBanner from "@/components/AdBanner";
import { Metadata } from "@/types/PageType";
import Script from "next/script";
import Faq from "@/components/Faq";
import {
  fetchGamingPhones,
  fetchBudgetLaptops,
  fetchAffordableHeadphones,
} from "@/lib/getDeals";

export const metadata: Metadata = {
  title: "DealWise – Smart Shopping for Budget Phones, Laptops & Tech Deals",
  description:
    "DealWise helps you compare prices on smartphones, laptops, and accessories from Shopee, TikTok Shop, Amazon, and more. Discover verified deals, save money, and shop smarter.",
  keywords: [
    "best deals online",
    "cheap phones",
    "budget smartphones",
    "laptop deals",
    "budget laptops",
    "gadget discounts",
    "tech accessories sale",
    "headphones deals",
    "Shopee tech deals",
    "TikTok Shop gadgets",
    "Amazon tech offers",
    "online shopping Philippines",
    "affordable gadgets",
    "electronics sale",
    "DealWise",
  ],
  authors: [{ name: "DealWise", url: "https://deal-wise.vercel.app/" }],
  openGraph: {
    title: "DealWise – Smart Shopping for Budget Tech Deals",
    description:
      "Compare the best deals on phones, laptops, and accessories. Save money with DealWise!",
    url: "https://deal-wise.vercel.app/",
    siteName: "DealWise",
    images: [
      {
        url: "https://deal-wise.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DealWise – Smart Shopping",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@DealWisePH",
    title: "DealWise – Best Deals Online",
    description:
      "Find verified tech deals on smartphones, laptops, and more with DealWise.",
    images: ["https://deal-wise.vercel.app/og-image.jpg"],
  },
};

export default async function HomePage() {
  // Fetch all data server-side for SEO
  const [gamingPhones, budgetLaptops, affordableHeadphones] = await Promise.all(
    [fetchGamingPhones(), fetchBudgetLaptops(), fetchAffordableHeadphones()]
  );

  return (
    <div className="text-center space-y-10 sm:space-y-12 px-4 sm:px-6 lg:px-8">
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Where can I find the best phone deals in the Philippines?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can find the best phone deals on Shopee, TikTok Shop, and Amazon. DealWise compares verified offers so you can easily find the cheapest prices on smartphones in the Philippines.",
                },
              },
              {
                "@type": "Question",
                name: "What are the best budget phones under 10,000 PHP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Some of the best budget smartphones under 10,000 PHP include models from Realme, Xiaomi, and Infinix. On DealWise, you can quickly compare their prices across Shopee, TikTok Shop, and Amazon.",
                },
              },
              {
                "@type": "Question",
                name: "Where can I buy affordable laptops online?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Affordable laptops are available on Shopee, TikTok Shop, and Amazon. DealWise makes it easier by gathering all the best laptop deals in one place so you can save money and shop smarter.",
                },
              },
              {
                "@type": "Question",
                name: "Does DealWise sell products directly?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, DealWise does not sell products directly. Instead, it compares deals from trusted platforms like Shopee, TikTok Shop, and Amazon, helping you find the lowest prices available.",
                },
              },
              {
                "@type": "Question",
                name: "Is DealWise available in the Philippines?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, DealWise is focused on the Philippines market, making it easier for Filipino shoppers to find verified tech deals online.",
                },
              },
            ],
          }),
        }}
      />

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
      <AdBanner />

      {/* Top Products Sections */}
      {gamingPhones.length > 0 && (
        <BudgetPhonesSection products={gamingPhones} />
      )}

      {budgetLaptops.length > 0 && (
        <LaptopRanking
          title="Top 10 Budget Laptops Under ₱20,000"
          products={budgetLaptops}
        />
      )}
      <Faq />
      <AdBanner />
    </div>
  );
}
