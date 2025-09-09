import mongoose, { Schema, model, models } from "mongoose";
import { PlatformOffer as Offer } from "@/types/Platform";
import type { Product as ProductType } from "@/types/product";

const OfferSchema = new Schema<Offer>(
  {
    merchant: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { _id: false } 
);

// --- Product schema ---
const ProductSchema = new Schema<ProductType>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String },
    offers: { type: [OfferSchema], default: [] },
    desc: { type: [String], default: [] },
  },
  { timestamps: true }
);

// --- Create or reuse model ---
const Product =
  models.Product || model<ProductType>("Product", ProductSchema);

export default Product;
