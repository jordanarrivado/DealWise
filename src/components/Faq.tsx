"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Where can I find the best phone deals in the Philippines?",
    a: "You can find the best phone deals on Shopee, TikTok Shop, and Amazon. DealWise compares verified offers so you can easily find the cheapest prices on smartphones in the Philippines.",
  },
  {
    q: "What are the best budget phones under 10,000 PHP?",
    a: "Some of the best budget smartphones under 10,000 PHP include models from Realme, Xiaomi, and Infinix. On DealWise, you can quickly compare their prices across Shopee, TikTok Shop, and Amazon.",
  },
  {
    q: "Where can I buy affordable laptops online?",
    a: "Affordable laptops are available on Shopee, TikTok Shop, and Amazon. DealWise makes it easier by gathering all the best laptop deals in one place so you can save money and shop smarter.",
  },
  {
    q: "Does DealWise sell products directly?",
    a: "No, DealWise does not sell products directly. Instead, it compares deals from trusted platforms like Shopee, TikTok Shop, and Amazon, helping you find the lowest prices available.",
  },
  {
    q: "Is DealWise available in the Philippines?",
    a: "Yes, DealWise is focused on the Philippines market, making it easier for Filipino shoppers to find verified tech deals online.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="max-w-3xl mx-auto my-12 px-4">
      {/* FAQ UI */}
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        📌 Frequently Asked Questions
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-900">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              className="flex w-full justify-between items-center px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-gray-700 dark:text-gray-300 text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
