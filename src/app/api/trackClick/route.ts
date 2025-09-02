// /app/api/trackClick/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Click from "@/models/Click";

export async function POST(req: NextRequest) {
  try {
    const { phoneName, merchant, url } = await req.json();

    await connectDB();

    // Increment count for this offer
    await Click.findOneAndUpdate(
      { phoneName, merchant, url },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error tracking click:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ✅ Add GET handler for admin dashboard
export async function GET() {
  try {
    await connectDB();
    const clicks = await Click.find().sort({ count: -1 }); // sort by most clicks
    return NextResponse.json(clicks);
  } catch (err) {
    console.error("Error fetching clicks:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
