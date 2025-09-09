import { PlatformOffer } from "@/types/Platform";

export interface Pencil {
  _id: string;
  title: string;
  hardness: string;
  material: string;
  shape: string;
  color: string;
  erasable: string;
  image?: string;
  offers: PlatformOffer[];
}