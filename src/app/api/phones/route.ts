import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Phone, PhonesOffers } from "@/models/Phones";
import cloudinary from "@/lib/cloudinary";

interface OfferInput {
  merchant: string;
  price: number | string;
  url: string;
  rating?: number | string;
  reviews?: number | string;
}

export async function GET() {
  try {
    await connectDB();

    const phones = await Phone.find().sort({ createdAt: -1 }).lean();

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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET /api/phones error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("GET /api/phones error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

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

    let imageUrl = "";
    if (data.imageBase64) {
      try {
        const upload = await cloudinary.uploader.upload(data.imageBase64, {
          folder: "phones",
        });
        imageUrl = upload.secure_url;
      } catch (err) {
        console.warn("Cloudinary upload failed, proceeding without image.", err);
      }
    }

    const phone = await Phone.create({
      name: data.name,
      gamingScore: Number(data.gamingScore),
      antutu: Number(data.antutu),
      camera: data.camera,
      battery: data.battery,
      display: data.display,
      chipset: data.chipset,
      image: imageUrl,
    });

    const offers = await PhonesOffers.insertMany(
      data.offers.map((offer: OfferInput) => ({
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("POST /api/phones error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("POST /api/phones error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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

    const phone = await Phone.findById(id);
    if (!phone) {
      return NextResponse.json(
        { error: "Phone not found." },
        { status: 404 }
      );
    }

    if (phone.image) {
      try {
        const publicId = phone.image.split("/phones/")[1]?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`phones/${publicId}`);
        }
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err);
      }
    }

    await Phone.findByIdAndDelete(id);
    await PhonesOffers.deleteMany({ phoneId: id });

    return NextResponse.json({ success: true, message: "Phone deleted." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("DELETE /api/phones error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("DELETE /api/phones error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Inside your route file

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Phone ID is required." }, { status: 400 });
    }

    const phone = await Phone.findById(id);
    if (!phone) {
      return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    }

    // Handle image update
    let imageUrl = phone.image;
    if (data.imageBase64) {
      try {
        // Delete old image if exists
        if (phone.image) {
          const publicId = phone.image.split("/phones/")[1]?.split(".")[0];
          if (publicId) await cloudinary.uploader.destroy(`phones/${publicId}`);
        }
        const upload = await cloudinary.uploader.upload(data.imageBase64, { folder: "phones" });
        imageUrl = upload.secure_url;
      } catch (err) {
        console.warn("Cloudinary upload failed, keeping old image.", err);
      }
    }

    // Update phone fields
    phone.name = data.name || phone.name;
    phone.gamingScore = Number(data.gamingScore) || phone.gamingScore;
    phone.antutu = Number(data.antutu) || phone.antutu;
    phone.camera = data.camera || phone.camera;
    phone.battery = data.battery || phone.battery;
    phone.display = data.display || phone.display;
    phone.chipset = data.chipset || phone.chipset;
    phone.image = imageUrl;

    await phone.save();

    // Update offers: remove old ones, insert new
    if (Array.isArray(data.offers)) {
      await PhonesOffers.deleteMany({ phoneId: id });
      await PhonesOffers.insertMany(
        data.offers.map((offer: OfferInput) => ({
          phoneId: id,
          merchant: offer.merchant,
          price: Number(offer.price),
          url: offer.url,
          rating: Number(offer.rating) || 0,
          reviews: Number(offer.reviews) || 0,
        }))
      );
    }

    const offers = await PhonesOffers.find({ phoneId: id }).lean();

    return NextResponse.json({
      ...phone.toObject(),
      offers: offers.map((o) => ({
        merchant: o.merchant,
        price: Number(o.price),
        url: o.url,
        rating: Number(o.rating) || 0,
        reviews: Number(o.reviews) || 0,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("PUT /api/phones error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
