import mongoose, { Schema, model, models, Document } from "mongoose";
import type { Product as ProductType, Offer } from "@/types/phone"; // your interfaces

// --- Offer schema ---
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
const ProductSchema = new Schema<ProductType & Document>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String },
    offers: { type: [OfferSchema], default: [] },
    desc: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ✅ Model with correct typing
const Product =
  (models.Product as mongoose.Model<ProductType & Document>) ||
  model<ProductType & Document>("Product", ProductSchema);

export default Product;
