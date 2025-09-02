import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Phone, PhonesOffers } from "@/models/Phones";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();

    const phones = await Phone.find().sort({ createdAt: -1 }).lean();

    // Attach offers
    const phonesWithOffers = await Promise.all(
      phones.map(async (phone) => {
        const offers = await PhonesOffers.find({ phoneId: phone._id }).lean();

        return {
          ...phone,
          offers: offers.map((o) => ({
            merchant: o.merchant,
            price: Number(o.price),
            url: o.url,
            rating: Number(o.rating) || 0,
            reviews: Number(o.reviews) || 0,
          })),
        };
      })
    );

    return NextResponse.json(phonesWithOffers);
  } catch (err: any) {
    console.error("GET /api/phones error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields (image is optional)
    if (
      !data.name ||
      data.gamingScore == null ||
      data.antutu == null ||
      !data.camera ||
      !data.battery ||
      !data.display ||
      !data.chipset ||
      !Array.isArray(data.offers) ||
      data.offers.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imageUrl = "";
    if (data.imageBase64) {
      try {
        const upload = await cloudinary.uploader.upload(data.imageBase64, {
          folder: "phones",
        });
        //console.log("Cloudinary upload result:", upload);
        imageUrl = upload.secure_url;
      } catch (err) {
        console.warn("Cloudinary upload failed, proceeding without image.", err);
      }
    }

    // Create phone
    const phone = await Phone.create({
      name: data.name,
      gamingScore: Number(data.gamingScore),
      antutu: Number(data.antutu),
      camera: data.camera,
      battery: data.battery,
      display: data.display,
      chipset: data.chipset,
      image: imageUrl, // will save empty string if no image
    });

    // Create offers linked to phone
    const offers = await PhonesOffers.insertMany(
      data.offers.map((offer: any) => ({
        phoneId: phone._id,
        merchant: offer.merchant,
        price: Number(offer.price),
        url: offer.url,
        rating: Number(offer.rating) || 0,
        reviews: Number(offer.reviews) || 0,
      }))
    );

    return NextResponse.json({
      ...phone.toObject(),
      offers,
    });
  } catch (err: any) {
    console.error("POST /api/phones error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Phone ID is required." },
        { status: 400 }
      );
    }

    // Find the phone first
    const phone = await Phone.findById(id);
    if (!phone) {
      return NextResponse.json(
        { error: "Phone not found." },
        { status: 404 }
      );
    }

    // ✅ Delete Cloudinary image if exists
    if (phone.image) {
      try {
        // Extract public_id from the URL (phones/xxxx)
        const publicId = phone.image.split("/phones/")[1]?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`phones/${publicId}`);
        }
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err);
      }
    }

    // ✅ Delete phone
    await Phone.findByIdAndDelete(id);

    // ✅ Delete related offers
    await PhonesOffers.deleteMany({ phoneId: id });

    return NextResponse.json({ success: true, message: "Phone deleted." });
  } catch (err: any) {
    console.error("DELETE /api/phones error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
