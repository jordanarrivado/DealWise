import { Schema, models, model } from "mongoose";
import { PlatformOffer } from "@/types/Platform";
import { Headphone } from "@/types/headphone";


const OfferSchema = new Schema<PlatformOffer>({
  merchant: { type: String, required: true },
  price: { type: Number, required: true },
  url: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
});

const HeadphoneSchema = new Schema<Headphone>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    connectivity: { type: String, required: true },
    impedance: { type: Number, required: true },
    frequencyResponse: { type: String, required: true },
    overallScore: {type: Number, required: true},
    image: { type: String, required: true },
    offers: { type: [OfferSchema], default: [] },
  },
  { timestamps: true }
);

const HeadphoneModel = models.Headphone || model<Headphone>("Headphone", HeadphoneSchema);

export default HeadphoneModel;
