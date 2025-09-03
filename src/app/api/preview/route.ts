import { NextResponse } from "next/server";
import axios from "axios";
import ogs from "open-graph-scraper";

const API_KEY = process.env.SCRAPER_API_KEY;

type OgImage = string | { url?: string } | Array<{ url?: string }> | undefined | null;

function normalizeImage(img: OgImage): string {
  if (!img) return "";
  if (Array.isArray(img)) return img[0]?.url || "";
  if (typeof img === "object") return img.url || "";
  return img;
}

function extractShopeeIds(url: string) {
  const m = url.match(/i\.(\d+)\.(\d+)/);
  return m ? { shopid: m[1], itemid: m[2] } : null;
}

async function resolveFinalUrl(url: string): Promise<string> {
  try {
    const resp = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: (s) => s === 301 || s === 302 || s === 200,
    });
    return resp.request?.res?.responseUrl || url;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const e = err as { response?: { status?: number; headers?: Record<string, string> } };
      if (e.response?.status === 301 || e.response?.status === 302) {
        return e.response.headers?.location || url;
      }
    }
    return url;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url) return NextResponse.json({ success: false, error: "No URL provided" });

    if (url.includes("shopee.") && extractShopeeIds(url)) {
      const { shopid, itemid } = extractShopeeIds(url)!;
      const target = `https://shopee.ph/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;
      const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(target)}`;
      const resp = await axios.get(scrapeUrl);
      const item = resp.data?.data;
      if (item?.itemid) {
        return NextResponse.json({
          success: true,
          title: item.name,
          price: (item.price / 100000).toFixed(2),
          image: item.images?.length ? `https://cf.shopee.ph/file/${item.images[0]}` : "",
          platform: "Shopee",
        });
      }
    }

    if (url.includes("tiktok.com")) {
      const finalUrl = await resolveFinalUrl(url);
      const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(finalUrl)}`;
      const { result } = await ogs({ url: scrapeUrl });
      return NextResponse.json({
        success: true,
        title: result.ogTitle || result.twitterTitle || "",
        price: "",
        image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage),
        platform: "TikTok",
      });
    }

    const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(url)}`;
    const { result } = await ogs({ url: scrapeUrl });

    return NextResponse.json({
      success: true,
      title: result.ogTitle || result.twitterTitle || "",
      price: "",
      image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage),
      platform: result.ogSiteName || result.twitterSite || "",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Scrape error:", err.message);
    } else {
      console.error("Scrape error:", err);
    }
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
