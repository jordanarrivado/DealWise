// "@/types/product.ts"
import { PlatformOffer } from "@/types/Platform";

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


