// /app/api/phones/checkName/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Phone } from "@/models/Phones"; // ✅ use Phone model

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // ensure Mongoose is connected

    const url = new URL(req.url);
    const name = url.searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Phone name is required" },
        { status: 400 }
      );
    }

    // ✅ match against "name" field, not "title"
    const exists = await Phone.findOne({
      name: { $regex: `^${name}$`, $options: "i" }, // case-insensitive exact match
    }).lean();

    return NextResponse.json({ exists: !!exists });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("checkName error:", err.message);
    } else {
      console.error("checkName error:", err);
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
