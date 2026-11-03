import { NextResponse } from "next/server";
import {
  getShopifyProducts,
  isShopifyConfigured,
  shopifyConfigMissing,
} from "@/lib/shopify";

export async function GET() {
  if (!isShopifyConfigured()) {
    const missing = shopifyConfigMissing();
    return NextResponse.json(
      {
        error: `Shopify belum dikonfigurasi. Missing: ${missing.join("; ")}. Set di Vercel → Settings → Environment Variables (Production), lalu Redeploy.`,
        missing,
      },
      { status: 503 }
    );
  }
  try {
    const products = await getShopifyProducts(50);
    return NextResponse.json({ products });
  } catch (e) {
    console.error("Shopify products error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal memuat produk Shopify" },
      { status: 500 }
    );
  }
}
