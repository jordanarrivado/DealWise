import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeadphoneModel from "@/models/Headphone";
import cloudinary from "@/lib/cloudinary";

// CREATE (POST)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.name || !data.offers || data.offers.length === 0) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    let imageUrl = "";
    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      imageUrl = upload.secure_url;
    }

    if (!imageUrl) throw new Error("Headphone image is required!");

    const newHeadphone = await HeadphoneModel.create({ ...data, image: imageUrl });
    return NextResponse.json(newHeadphone, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/headphone", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// READ (GET)
export async function GET() {
  try {
    await connectDB();
    const headphones = await HeadphoneModel.find({});
    return NextResponse.json(headphones, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/headphone", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE (PUT)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data._id) {
      return NextResponse.json({ error: "Headphone ID is required" }, { status: 400 });
    }

    let updateData = { ...data };

    if (data.imageBase64) {
      const upload = await cloudinary.uploader.upload(data.imageBase64, {
        folder: "affiliate-products",
      });
      updateData.image = upload.secure_url;
    }

    const updatedHeadphone = await HeadphoneModel.findByIdAndUpdate(
      data._id,
      updateData,
      { new: true }
    );

    if (!updatedHeadphone) {
      return NextResponse.json({ error: "Headphone not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHeadphone, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /api/headphone", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Headphone ID is required" }, { status: 400 });
    }

    const deletedHeadphone = await HeadphoneModel.findByIdAndDelete(_id);

    if (!deletedHeadphone) {
      return NextResponse.json({ error: "Headphone not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Headphone deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("DELETE /api/headphone", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
