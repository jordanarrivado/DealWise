import PencilRanking from "../best-budget-pencil/PencilRanking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 10 Pencils for Artists – PencilWise",
  description:
    "Discover the best pencils for drawing and sketching. Compare hardness, material, shape, color, erasable properties, and find the best offers from trusted platforms.",
};

// Fetch top pencils from API
async function fetchTopPencils() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/pencils?limit=10`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch pencils");
  return res.json();
}

export default async function TopPencilsPage() {
  const topPencils = await fetchTopPencils();

  return (
    <PencilRanking title="Top 10 Pencils for Artists" products={topPencils} />
  );
}
