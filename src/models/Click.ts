import mongoose, { Schema } from "mongoose";

const ClickSchema = new Schema({
  phoneName: String,
  merchant: String,
  url: String,
  count: { type: Number, default: 0 },
});

export default mongoose.models.Click || mongoose.model("Click", ClickSchema);