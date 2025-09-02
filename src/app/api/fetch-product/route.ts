import { NextResponse } from "next/server";
import ogs from "open-graph-scraper"; // npm install open-graph-scraper

function normalizeImage(img: any): string {
  if (!img) return "";
  if (Array.isArray(img)) return img[0]?.url || "";
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

    // Example: transform OG data into your product shape
    const product = {
      title: result.ogTitle || result.twitterTitle || "Untitled",
      description: result.ogDescription || "",
      siteName: result.ogSiteName || result.twitterSite || "",
      url: result.ogUrl || result.requestUrl || url,
      image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage) || "",
      price: "", // optional: fill manually or scrape separately
    };

    return NextResponse.json(product);
  } catch (err) {
    console.error("Fetch product error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}
