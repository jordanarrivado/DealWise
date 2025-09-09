import SketchPadRanking from "./SketchPadRanking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best SketchPads for Artists – SketchWise",
  description:
    "Discover the best sketchpads for drawing and sketching. Compare size, page count, paper GSM, binding, type, and get the best offers from trusted platforms.",
};

// Fetch top sketchpads from API
async function fetchTopSketchPads() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sketchpad?limit=10`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch sketchpads");
  return res.json();
}

export default async function TopSketchPadsPage() {
  const topSketchPads = await fetchTopSketchPads();

  return (
    <SketchPadRanking
      title="Best SketchPads for Artists"
      products={topSketchPads}
    />
  );
}
