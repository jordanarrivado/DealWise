import { PlatformOffer } from "@/types/Platform";

export interface Headphone {
  _id: string;
  name: string;
  type: string;   
  connectivity: string; 
  impedance: number;   
  frequencyResponse?: string;
  overallScore: number;
  image: string;
  offers: PlatformOffer[];
}