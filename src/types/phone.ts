// "@/types/product.ts"
export interface PlatformOffer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

export interface Phone {
  name: string;
  gamingScore: number;
  antutu: number;
  camera: string;
  battery: string;
  display: string;
  chipset: string;
  image: string;
  offers: PlatformOffer[];
}
