import { NextResponse } from "next/server";
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify belum dikonfigurasi" },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  if (!rateLimit(`shopify-checkout:${ip}`, 15, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const lines = Array.isArray(body.lines) ? body.lines : [];
    const country = typeof body.country === "string" ? body.country : undefined;

    if (!lines.length) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    const normalized = lines
      .map((l: { merchandiseId?: string; quantity?: number }) => ({
        merchandiseId: String(l.merchandiseId || ""),
        quantity: Math.max(1, Math.floor(Number(l.quantity) || 1)),
      }))
      .filter((l: { merchandiseId: string }) => l.merchandiseId.startsWith("gid://"));

    if (!normalized.length) {
      return NextResponse.json(
        { error: "Variant Shopify tidak valid" },
        { status: 400 }
      );
    }

    const { cartId, checkoutUrl } = await createShopifyCheckout(
      normalized,
      country,
      ip !== "unknown" ? ip : undefined
    );
    return NextResponse.json({ cartId, checkoutUrl });
  } catch (e) {
    console.error("Shopify checkout error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal membuat checkout" },
      { status: 500 }
    );
  }
}
