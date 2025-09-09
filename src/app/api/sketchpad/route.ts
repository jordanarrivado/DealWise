import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SketchPad from "@/models/SketchPad";
import cloudinary from "@/lib/cloudinary";
import { PlatformOffer} from "@/types/Platform";

interface SketchType {
  _id?: string;
  title: string;
  size: string;
  pageCount: number;
  paperGSM: number;
  binding: string;
  type: string;
  offers: PlatformOffer[];
  image: string;
  imageBase64: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CREATE (POST)

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (
      !body.title?.trim() ||
      !body.size?.trim() ||
      body.pageCount == null ||
      body.paperGSM == null ||
      !body.binding?.trim() ||
      !body.type?.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Extract imageBase64 and keep the rest
    const { imageBase64, ...rest } = body;

    let imageUrl = "";
    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: "affiliate-products",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) throw new Error("SketchPad Image is required!");

    const newSketchPad = await SketchPad.create({ ...rest, image: imageUrl });
    return NextResponse.json(newSketchPad, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/sketchpad", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// READ (GET)
export async function GET() {
  try {
    await connectDB();
    const products = await SketchPad.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/sketchpad", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


//PUT
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body: SketchType = await req.json();

    if (!body._id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { imageBase64, ...rest } = body;
    let updateData: Partial<SketchType> = { ...rest };

    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: "affiliate-products",
      });
      updateData.image = upload.secure_url;
    }

    const updatedProduct = await SketchPad.findByIdAndUpdate(
      body._id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /api/sketchpad", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// DELETE
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const deletedProduct = await SketchPad.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("DELETE /api/sketchpad", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
