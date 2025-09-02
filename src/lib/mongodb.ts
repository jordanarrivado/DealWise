import mongoose from "mongoose";
import Product from "@/models/Product"; // make sure you have your Product model here
import { Product as ProductType } from "@/types/product";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Fetch products from MongoDB with optional filters
 * @param filter MongoDB filter (example: { category: "gaming-phones" })
 * @param limit Number of results (example: 10)
 */
export async function fetchProducts(
  filter: Partial<ProductType> = {},
  limit = 0
): Promise<ProductType[]> {
  await connectDB();

  let query = Product.find(filter).lean(); // plain JS objects
  if (limit > 0) query = query.limit(limit);

  const docs = await query;

  // Map to ensure each object has the required fields
  const products: ProductType[] = docs.map((doc: any) => ({
    _id: doc._id.toString(),
    title: doc.title ?? "",
    price: doc.price ?? 0,
    link: doc.link ?? "",
    image: doc.image ?? "",
    platform: doc.platform ?? "",
    category: doc.category ?? "",
    offers: doc.offers ?? [], // ✅ include offers
  }));

  return products;
}


