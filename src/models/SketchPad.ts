import mongoose, { Schema, model, models } from "mongoose";

const OfferSchema = new Schema(
  {
    merchant: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    rating: { type: Number, required: false },
    reviews: { type: Number, required: false },
  },
  { _id: false }
);

const SketchPadSchema = new Schema(
  {
    title: { type: String, required: true },
    size: { type: String, required: true },
    pageCount: { type: Number, required: true },
    paperGSM: { type: Number, required: true },
    binding: { type: String, required: true },
    type: { type: String, required: true },
    offers: [OfferSchema],
    image: { type: String, required: true }, 
  },
  { timestamps: true }
);

const SketchPad = models.SketchPad || model("SketchPad", SketchPadSchema);
export default SketchPad;
