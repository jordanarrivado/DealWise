import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Transform to match ProductComparison interface
    const transformed = products.map((p) => ({
       _id: p._id.toString(),
      title: p.title,
      category: p.category || "",
      image: p.image,
      desc: p.desc || [],
      offers: (p.offers || []).map((o: any) => ({
        merchant: o.merchant,
        price: Number(o.price),
        url: o.url,       // Make sure your DB uses `url` for offer links
        rating: Number(o.rating) || 0,
        reviews: Number(o.reviews) || 0,
      })),
    }));

    return NextResponse.json(transformed);
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.offers || !Array.isArray(data.offers) || data.offers.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one offer are required." },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imageUrl = "";
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) throw new Error("Product image is required.");

    // Map offers and ensure numeric values
    const offers = data.offers.map((offer: any) => {
      if (!offer.merchant || !offer.price || !offer.url) {
        throw new Error("Each offer must have merchant, price, and url.");
      }
      return {
        merchant: offer.merchant,
        price: Number(offer.price),
        url: offer.url,
        rating: offer.rating ? Number(offer.rating) : 0,
        reviews: offer.reviews ? Number(offer.reviews) : 0,
      };
    });

    // Create product with desc included
    const product = await Product.create({
      title: data.title,
      image: imageUrl,
      category: data.category || null,
      offers,
      desc: Array.isArray(data.desc) ? data.desc : [],
    });

    return NextResponse.json({ message: "Product created successfully", product });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    // ✅ Extract product id from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find and delete product
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
