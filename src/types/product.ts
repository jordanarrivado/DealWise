import { PlatformOffer as Offer } from "@/types/Platform";

export interface Product {
  title: string;
  category?: string;
  image: string;
  offers: Offer[];
  desc?: string[];
}

export interface ProductComparisonProps {
  products: Product[];
}
