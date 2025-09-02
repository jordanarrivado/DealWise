import { NextResponse } from "next/server";
import axios from "axios";
import ogs from "open-graph-scraper";

const API_KEY = process.env.SCRAPER_API_KEY;

function normalizeImage(img: any): string {
  if (!img) return "";
  if (Array.isArray(img)) return img[0]?.url || "";
  if (typeof img === "object") return img.url || "";
  return img;
}

function extractShopeeIds(url: string) {
  const m = url.match(/i\.(\d+)\.(\d+)/);
  return m ? { shopid: m[1], itemid: m[2] } : null;
}

// Follow redirects to get final TikTok URL
async function resolveFinalUrl(url: string): Promise<string> {
  try {
    const resp = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: (s) => s === 301 || s === 302 || s === 200,
    });
    // If no redirect, return original
    return resp.request?.res?.responseUrl || url;
  } catch (err: any) {
    if (err.response?.status === 301 || err.response?.status === 302) {
      return err.response.headers.location || url;
    }
    return url;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url) return NextResponse.json({ success: false, error: "No URL provided" });

    // --- 1) Shopee handling ---
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

    // --- 2) TikTok special handling ---
    if (url.includes("tiktok.com")) {
      const finalUrl = await resolveFinalUrl(url);
      const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(finalUrl)}`;
      const { result } = await ogs({ url: scrapeUrl });

      return NextResponse.json({
        success: true,
        title: result.ogTitle || result.twitterTitle || "",
        price: "", // No reliable price scraping
        image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage),
        platform: "TikTok",
      });
    }

    // --- 3) Fallback for any other link ---
    const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(url)}`;
    const { result } = await ogs({ url: scrapeUrl });

    return NextResponse.json({
      success: true,
      title: result.ogTitle || result.twitterTitle || "",
      price: "",
      image: normalizeImage(result.ogImage) || normalizeImage(result.twitterImage),
      platform: result.ogSiteName || result.twitterSite || "",
    });

  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
