// models/Phones.ts
import mongoose, { Schema, model, models } from "mongoose";

// Phone schema
const PhoneSchema = new Schema(
  {
    name: { type: String, required: true },
    gamingScore: { type: Number, required: true },
    antutu: { type: Number, required: true },
    camera: { type: String, required: true },
    battery: { type: String, required: true },
    display: { type: String, required: true },
    chipset: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// Offers schema
const PhonesOffersSchema = new Schema(
  {
    phoneId: { type: Schema.Types.ObjectId, ref: "Phone", required: true }, // 👈 use "Phone"
    merchant: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Export with consistent names
export const Phone = models.Phone || model("Phone", PhoneSchema);
export const PhonesOffers =
  models.PhonesOffers || model("PhonesOffers", PhonesOffersSchema);
