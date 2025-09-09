import mongoose, { Schema, model, models } from "mongoose";

const OfferSchema = new Schema(
  {
    merchant: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    url: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    reviews: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const PencilSchema = new Schema(
  {
    title: { type: String, required: true },
    hardness: { type: String, required: true },
    material: { type: String },
    shape: { type: String },
    color: { type: String },
    erasable: { type: String, enum: ["Yes", "No"], required: true },
    offers: { type: [OfferSchema], default: [] },
    image: { type: String , required: true},
  },
  { timestamps: true }
);

const Pencil = models.Pencil || model("Pencil", PencilSchema);
export default Pencil;
