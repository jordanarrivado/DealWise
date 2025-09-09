import { PlatformOffer } from "@/types/Platform";
/*
export interface PlatformOffer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}
*/
export interface Laptop {
  name: string;
  processor: string;
  ram: number;
  storage: string;
  display: string;
  image: string;
  performanceScore: number;
  offers: PlatformOffer[];
}