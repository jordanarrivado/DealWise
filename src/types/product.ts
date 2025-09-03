// types/product.ts
export interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

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
