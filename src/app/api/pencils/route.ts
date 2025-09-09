import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PencilModel from "@/models/Pencil";
import cloudinary from "@/lib/cloudinary";
import { PlatformOffer } from "@/types/Platform";
// CREATE (POST)
// CREATE (POST)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.title || data.offers.length === 0) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    let imageUrl = "";
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products/pencils",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "Pencil image is required!" }, { status: 400 });
    }

    // ✅ Build safe object without `imageBase64`
    const pencilData = {
      title: data.title,
      hardness: data.hardness,
      material: data.material,
      shape: data.shape,
      color: data.color,
      erasable: data.erasable,
      offers: data.offers,
      image: imageUrl,
    };

    const newPencil = await PencilModel.create(pencilData);
    return NextResponse.json(newPencil, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/pencils", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// READ (GET all)
export async function GET() {
  try {
    await connectDB();
    const pencils = await PencilModel.find({});
    return NextResponse.json(pencils, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/pencils", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface updatePencil {
    title: string;
    hardness: string;
    material: string;
    shape: string;
    color: string;
    erasable: string;
    image?: string;
    offers: PlatformOffer[];
}
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data._id) {
      return NextResponse.json({ error: "Pencil ID is required" }, { status: 400 });
    }

    const updateData: updatePencil = {
      title: data.title,
      hardness: data.hardness,
      material: data.material,
      shape: data.shape,
      color: data.color,
      erasable: data.erasable,
      offers: data.offers,
    };

    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products/pencils",
      });
      updateData.image = upload.secure_url;
    }

    const updatedPencil = await PencilModel.findByIdAndUpdate(
      data._id,
      updateData,
      { new: true }
    );

    if (!updatedPencil) {
      return NextResponse.json({ error: "Pencil not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPencil, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /api/pencils", err);
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

    const deletedProduct = await PencilModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("DELETE /api/pencils", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

