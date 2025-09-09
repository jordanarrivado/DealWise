import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import { PlatformOffer as Offer } from "@/types/Platform";
import type { Product as ProductType } from "@/types/product";

const handleError = (err: unknown, endpoint: string) => {
  if (err instanceof Error) console.error(`${endpoint} error:`, err.message);
  else console.error(`${endpoint} unknown error:`, err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Unknown error" },
    { status: 500 }
  );
};

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 }).lean<ProductType[]>();

    const transformed = products.map((p) => ({
      ...p,
      category: p.category || "",
      desc: p.desc || [],
      offers: (p.offers || []).map((o) => ({
        merchant: o.merchant,
        price: Number(o.price),
        url: o.url,
        rating: o.rating != null ? Number(o.rating) : 0,
        reviews: o.reviews != null ? Number(o.reviews) : 0,
      })),
    }));

    return NextResponse.json(transformed);
  } catch (err: unknown) {
    return handleError(err, "GET /api/products");
  }
}

// --- POST ---
export async function POST(req: Request) {
  try {
    await connectDB();

    const data = (await req.json()) as {
      title: string;
      category?: string;
      imageBase64?: string;
      offers: Offer[];
      desc?: string[];
    };

    if (!data.title || !Array.isArray(data.offers) || data.offers.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one offer are required." },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) throw new Error("Product image is required.");

    const offers: Offer[] = data.offers.map((offer) => {
      if (!offer.merchant || offer.price == null || !offer.url) {
        throw new Error("Each offer must have merchant, price, and url.");
      }
      return {
        merchant: offer.merchant,
        price: Number(offer.price),
        url: offer.url,
        rating: offer.rating != null ? Number(offer.rating) : 0,
        reviews: offer.reviews != null ? Number(offer.reviews) : 0,
      };
    });

    const product = await Product.create({
      title: data.title,
      image: imageUrl,
      category: data.category,
      offers,
      desc: Array.isArray(data.desc) ? data.desc : [],
    });

    return NextResponse.json({ message: "Product created successfully", product });
  } catch (err: unknown) {
    return handleError(err, "POST /api/products");
  }
}

// --- DELETE ---
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: unknown) {
    return handleError(err, "DELETE /api/products");
  }
}
