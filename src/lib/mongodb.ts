import mongoose from "mongoose";
import Product from "@/models/Product";
import { PlatformOffer as Offer } from "@/types/Platform";
import type { Product as ProductType } from "@/types/product";


const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in .env.local");
}

const uri: string = MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
export async function fetchProducts(
  filter: Partial<Omit<ProductType, "_id">> = {},
  limit?: number
): Promise<(ProductType & { _id: string })[]> {
  const finalLimit = limit ?? 0;
  await connectDB();

  const rawDocs = await Product.find(filter)
    .limit(finalLimit)
    .lean();

  const docs = rawDocs as unknown as (ProductType & { _id: mongoose.Types.ObjectId })[];

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    title: doc.title,
    image: doc.image,
    category: doc.category ?? "",
    desc: doc.desc ?? [],
    offers: (doc.offers || []).map((offer: Offer) => ({
      merchant: offer.merchant,
      price: Number(offer.price),
      url: offer.url,
      rating: offer.rating ?? 0,
      reviews: offer.reviews ?? 0,
    })),
  }));
}

