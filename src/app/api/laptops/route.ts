import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LaptopModel from "@/models/Laptop";
import cloudinary from "@/lib/cloudinary";

// CREATE (POST)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.name || data.offers.length === 0) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    let imageUrl = "";
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) throw new Error("Laptop Image is required!");

    const newLaptop = await LaptopModel.create({ ...data, image: imageUrl });
    return NextResponse.json(newLaptop, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/laptops", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// READ (GET)
export async function GET() {
  try {
    await connectDB();
    const laptops = await LaptopModel.find({});
    return NextResponse.json(laptops, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/laptops", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE (PUT)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data._id) {
      return NextResponse.json({ error: "Laptop ID is required" }, { status: 400 });
    }

    let updateData = { ...data };

    // If new image provided, upload to cloudinary
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      updateData.image = upload.secure_url;
    }

    const updatedLaptop = await LaptopModel.findByIdAndUpdate(
      data._id,
      updateData,
      { new: true }
    );

    if (!updatedLaptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLaptop, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /api/laptops", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Laptop ID is required" }, { status: 400 });
    }

    const deletedLaptop = await LaptopModel.findByIdAndDelete(_id);

    if (!deletedLaptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Laptop deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("DELETE /api/laptops", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
