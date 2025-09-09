// /app/api/phones/checkName/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Laptop  from "@/models/Laptop";

export async function GET(req: NextRequest) {
  try {
    await connectDB(); 

    const url = new URL(req.url);
    const name = url.searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Phone name is required" },
        { status: 400 }
      );
    }

    const exists = await Laptop.findOne({
      name: { $regex: `^${name}$`, $options: "i" }, 
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
