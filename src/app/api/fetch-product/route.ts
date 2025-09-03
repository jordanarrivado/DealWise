import { NextResponse } from "next/server";
import ogs from "open-graph-scraper"; // npm install open-graph-scraper

type OGImage = { url?: string } | string;
type OGImageInput = OGImage | OGImage[] | null | undefined;

function normalizeImage(img: OGImageInput): string {
  if (!img) return "";
  if (Array.isArray(img)) {
    const first = img[0];
    return typeof first === "string" ? first : first?.url || "";
  }
  if (typeof img === "object") return img.url || "";
  return img;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "No URL provided" }, { status: 400 });
    }

    const { result } = await ogs({ url });

    const product = {
      title: result.ogTitle || result.twitterTitle || "Untitled",
      description: result.ogDescription || "",
      siteName: result.ogSiteName || result.twitterSite || "",
      url: result.ogUrl || result.requestUrl || url,
      image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage) || "",
      price: "",
    };

    return NextResponse.json(product);
  } catch (err) {
    console.error("Fetch product error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}
