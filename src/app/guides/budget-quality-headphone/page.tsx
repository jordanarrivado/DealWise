import HeadphoneRanking from "../budget-quality-headphone/HeadphoneRanking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affordable Headphones – DealWise",
  description:
    "Discover affordable headphones in the Philippines. Compare types, connectivity, battery life, and get the best offers from trusted platforms.",
};

async function fetchAffordableHeadphones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/headphone?category=affordable&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function AffordableHeadphonesPage() {
  const affordableHeadphones = await fetchAffordableHeadphones();

  return (
    <HeadphoneRanking
      title="Top 10 Affordable Headphones"
      products={affordableHeadphones}
    />
  );
}
