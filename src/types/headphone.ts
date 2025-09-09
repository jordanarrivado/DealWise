import { PlatformOffer } from "./Platform";

export interface Headphone {
  name: string;
  type: string;   
  connectivity: string; 
  impedance: number;   
  frequencyResponse?: string;
  overallScore: number;
  image?: string;
  offers: PlatformOffer[];
}