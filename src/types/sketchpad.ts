import { PlatformOffer as Offer } from "./Platform";

export interface SketchPad {
  _id?: string;
  title: string;
  size: string;
  pageCount: number;
  paperGSM: number;
  binding: string;
  type: string;
  offers: Offer[];
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
