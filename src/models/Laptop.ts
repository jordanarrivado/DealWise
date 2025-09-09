import { Schema, models, model } from "mongoose";
import { PlatformOffer } from "@/types/Platform";
import { Laptop } from "@/types/laptop";

const OfferSchema = new Schema<PlatformOffer>({
  merchant:{type: String, required: true},
  price:{type: Number, required: true},
  url: {type: String, required: true},
  rating: {type: Number, default: 0},
  reviews: {type: Number, default: 0}
});

const LaptopSchema = new Schema<Laptop>({
  name: {type: String, required: true},
  processor: {type: String, required: true},
  ram: {type: Number, required: true},
  storage: {type: String, required: true},
  display: {type: String, required: true},
  image: { type: String, required: true },
  performanceScore: {type: Number, required: true},
  offers:{type: [OfferSchema], default: []}
},
{timestamps: true}
);

const LaptopModel = models.Laptop || model<Laptop>("Laptop", LaptopSchema);

export default LaptopModel;