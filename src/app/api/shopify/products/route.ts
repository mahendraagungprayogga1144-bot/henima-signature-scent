import { NextResponse } from "next/server";
import { getShopifyProducts, isShopifyConfigured } from "@/lib/shopify";

export async function GET() {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify belum dikonfigurasi. Cek environment variables." },
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
