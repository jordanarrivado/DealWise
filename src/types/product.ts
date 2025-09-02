export interface Offer {
  merchant: string;
  price: number;   // must always be number
  url: string;
  rating: number;  // number, default 0
  reviews: number; // number, default 0
}

export interface Product {
  _id: string;
  title: string;
  category?: string;
  image: string;
  offers: Offer[];
  desc?: string[];
}

