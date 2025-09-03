import mongoose, { Schema, model, models } from "mongoose";
import type { Product as ProductType, Offer } from "@/types/product";

// --- Offer schema ---
const OfferSchema = new Schema<Offer>(
  {
    merchant: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { _id: false } // subdocuments don't need their own _id
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
