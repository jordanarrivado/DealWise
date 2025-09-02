import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "Compare Products – DealWise",
  description:
    "View and compare smartphones, laptops, and accessories side by side. Check prices, ratings, and reviews to find the best deal instantly.",
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
