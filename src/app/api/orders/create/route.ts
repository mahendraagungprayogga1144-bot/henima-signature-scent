import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { getCurrentUser } from "@/lib/session";
import {
  effectiveShippingCost,
  getOrCreateMemberProfile,
  memberDiscountForSubtotal,
} from "@/lib/membership";
import { createOrderAccessToken } from "@/lib/order-access";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import type { Product } from "@/lib/types";

const ADMIN_WA = process.env.ADMIN_WHATSAPP || "6285190311230";

type CartLine = {
  productId: string;
  variantId: string;
  productName?: string;
  sizeMl?: number;
  price?: number;
  quantity: number;
};

function mapProduct(row: Record<string, unknown>): Product {
  // Inline mapper to avoid circular deps if helper missing
  const photo = (row.photo as string) ?? "/products/placeholder.svg";
  const photos = Array.isArray(row.photos) && row.photos.length
    ? (row.photos as string[])
    : [photo];
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    photo: photos[0] || photo,
    photos,
    video: typeof row.video === "string" && row.video.trim() ? row.video : undefined,
    originalPrice: Number(row.original_price) || 0,
    discountPrice: Number(row.discount_price) || 0,
    active: Boolean(row.active),
    variants: (row.variants as Product["variants"]) ?? [],
    comingSoon: Boolean(row.coming_soon),
    isGiftSet: Boolean(row.is_gift_set),
    bundleItems: Array.isArray(row.bundle_items)
      ? (row.bundle_items as Product["bundleItems"])
      : [],
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    items: rawItems,
    name,
    phone,
    email,
    address,
    city,
    province,
    postalCode,
    courier,
    courierName,
    shippingCost: clientShipping,
    voucher_code: voucherCodeRaw,
  } = body as {
    items: CartLine[];
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    courier: string;
    courierName: string;
    shippingCost: number;
    voucher_code?: string;
  };

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
  }
  if (!name || !phone || !email || !address || !city) {
    return NextResponse.json({ error: "Data pengiriman tidak lengkap" }, { status: 400 });
  }

  const productIds = [...new Set(rawItems.map((i) => i.productId).filter(Boolean))];
  const { data: productRows, error: prodErr } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  if (prodErr || !productRows?.length) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 400 });
  }

  const products = new Map(productRows.map((r) => [r.id as string, mapProduct(r as Record<string, unknown>)]));
  const pricedItems: Array<{
    productId: string;
    variantId: string;
    productName: string;
    sizeMl: number;
    quantity: number;
    price: number;
  }> = [];

  for (const line of rawItems) {
    const qty = Math.max(0, Math.floor(Number(line.quantity) || 0));
    if (!qty) continue;
    const product = products.get(line.productId);
    if (!product || !product.active || product.comingSoon) {
      return NextResponse.json(
        { error: `Produk tidak tersedia: ${line.productId}` },
        { status: 400 }
      );
    }
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant || !variant.active) {
      return NextResponse.json(
        { error: `Varian tidak valid untuk ${product.name}` },
        { status: 400 }
      );
    }
    if (variant.stock < qty) {
      return NextResponse.json(
        {
          error: `Stok tidak cukup untuk ${product.name} ${variant.sizeMl}ml (tersisa ${variant.stock})`,
        },
        { status: 400 }
      );
    }
    pricedItems.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      sizeMl: variant.sizeMl,
      quantity: qty,
      price: Number(variant.discountPrice) || Number(variant.originalPrice) || 0,
    });
  }

  if (!pricedItems.length) {
    return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
  }

  const subtotal = pricedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const rawShipping = Math.max(0, Number(clientShipping) || 0);

  // Voucher (server-validated)
  let voucherCode: string | null = null;
  let voucherDiscount = 0;
  const code = String(voucherCodeRaw || "").trim().toUpperCase();
  if (code) {
    const { data: voucher } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();

    if (!voucher) {
      return NextResponse.json({ error: "Voucher tidak ditemukan" }, { status: 400 });
    }
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return NextResponse.json({ error: "Voucher sudah kadaluarsa" }, { status: 400 });
    }
    if (voucher.used_count >= voucher.max_uses) {
      return NextResponse.json({ error: "Voucher sudah habis digunakan" }, { status: 400 });
    }
    if (subtotal < Number(voucher.min_order || 0)) {
      return NextResponse.json(
        {
          error: `Minimum order Rp ${Number(voucher.min_order).toLocaleString("id-ID")} untuk voucher ini`,
        },
        { status: 400 }
      );
    }
    voucherCode = voucher.code;
    if (voucher.type === "percent" || voucher.discount_type === "percent") {
      const pct = Number(voucher.value ?? voucher.discount_value ?? 0);
      voucherDiscount = Math.floor((subtotal * pct) / 100);
    } else {
      voucherDiscount = Math.floor(Number(voucher.value ?? voucher.discount_value ?? 0));
    }
    voucherDiscount = Math.min(voucherDiscount, subtotal);
  }

  const user = await getCurrentUser();
  let userId: string | null = null;
  let memberDiscount = 0;
  let shippingCost = rawShipping;
  let tierLabel: string | null = null;

  if (user && user.role !== "admin") {
    userId = user.id;
    try {
      const profile = await getOrCreateMemberProfile(user.id);
      memberDiscount = memberDiscountForSubtotal(profile.tier, subtotal);
      shippingCost = effectiveShippingCost(profile.tier, rawShipping);
      tierLabel = profile.tier;
    } catch (e) {
      console.error("Membership lookup failed:", e);
    }
  }

  const total = Math.max(0, subtotal + shippingCost - memberDiscount - voucherDiscount);
  const orderId =
    "ORD-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const accessToken = createOrderAccessToken(orderId, String(phone));

  // Decrement stock then insert order
  for (const item of pricedItems) {
    const product = products.get(item.productId)!;
    const variants = product.variants.map((v) =>
      v.id === item.variantId ? { ...v, stock: v.stock - item.quantity } : v
    );
    const { error: stockErr } = await supabase
      .from("products")
      .update({ variants })
      .eq("id", item.productId);
    if (stockErr) {
      console.error("Stock update failed:", stockErr);
      return NextResponse.json({ error: "Gagal memperbarui stok" }, { status: 500 });
    }
    product.variants = variants;
  }

  const { error } = await supabase.from("retail_orders").insert({
    id: orderId,
    items: pricedItems,
    customer: { name, phone, email, address, city, province, postalCode },
    courier,
    courier_name: courierName,
    shipping_cost: shippingCost,
    subtotal,
    total,
    status: "pending_payment",
    user_id: userId,
    member_discount: memberDiscount,
    voucher_code: voucherCode,
    voucher_discount: voucherDiscount,
  });

  if (error) {
    console.error("Order error:", error);
    // Best-effort: restore stock on insert failure
    for (const item of pricedItems) {
      const { data: row } = await supabase.from("products").select("variants").eq("id", item.productId).maybeSingle();
      if (row?.variants) {
        const variants = (row.variants as Product["variants"]).map((v) =>
          v.id === item.variantId ? { ...v, stock: v.stock + item.quantity } : v
        );
        await supabase.from("products").update({ variants }).eq("id", item.productId);
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (voucherCode) {
    try {
      const { data: v } = await supabase
        .from("vouchers")
        .select("used_count")
        .eq("code", voucherCode)
        .maybeSingle();
      if (v) {
        await supabase
          .from("vouchers")
          .update({ used_count: Number(v.used_count || 0) + 1 })
          .eq("code", voucherCode);
      }
    } catch (e) {
      console.error("Voucher increment failed:", e);
    }
  }

  try {
    if (email) {
      await supabase
        .from("subscribers")
        .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    }
  } catch (e) {
    console.error("Subscribe error:", e);
  }

  try {
    const itemsList = pricedItems
      .map((i) => `${i.productName} ${i.sizeMl}ml x${i.quantity}`)
      .join("\n");
    const msg = `ORDER BARU MASUK!

Order ID: ${orderId}
Nama: ${name}
WA: ${phone}
Kota: ${city}
${userId ? `Member: ${tierLabel || "yes"}` : "Guest checkout"}

Produk:
${itemsList}

Ongkir: Rp ${Number(shippingCost).toLocaleString("id-ID")}
${memberDiscount > 0 ? `Diskon member: -Rp ${memberDiscount.toLocaleString("id-ID")}\n` : ""}${voucherDiscount > 0 ? `Voucher ${voucherCode}: -Rp ${voucherDiscount.toLocaleString("id-ID")}\n` : ""}Total: Rp ${Number(total).toLocaleString("id-ID")}

Cek di: henimaofficial.com/admin/orders`;

    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FONNTE_TOKEN || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: ADMIN_WA,
        message: msg,
      }),
    });
  } catch (e) {
    console.error("WA notif error:", e);
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const itemsHtml = pricedItems
      .map(
        (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${i.productName} ${i.sizeMl}ml</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">Rp ${(i.price * i.quantity).toLocaleString("id-ID")}</td>
      </tr>`
      )
      .join("");

    const trackUrl = `https://henimaofficial.com/order/${orderId}?t=${encodeURIComponent(accessToken)}`;

    await resend.emails.send({
      from: "Henima Signature Scent <noreply@henimaofficial.com>",
      to: email,
      subject: `Order Confirmed - ${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;background:#FAF8F4;margin:0;padding:0;">
          <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
            <div style="text-align:center;margin-bottom:40px;">
              <h1 style="font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:28px;font-weight:300;letter-spacing:8px;color:#1C1917;margin:0;">HENIMA</h1>
              <p style="font-size:10px;letter-spacing:3px;color:#9A8F82;text-transform:uppercase;margin-top:4px;">Signature Scent</p>
            </div>
            <div style="border-top:1px solid #E8E0D5;border-bottom:1px solid #E8E0D5;padding:32px 0;margin-bottom:32px;text-align:center;">
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B5935A;margin-bottom:8px;">Order Confirmed</p>
              <h2 style="font-size:22px;font-weight:300;color:#1C1917;margin:0;">${orderId}</h2>
            </div>
            <p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;">
              Halo <strong>${name}</strong>, terima kasih telah berbelanja di Henima Signature Scent. Pesanan kamu telah kami terima dan sedang menunggu konfirmasi pembayaran.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:left;padding-bottom:12px;border-bottom:2px solid #1C1917;">Produk</th>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:center;padding-bottom:12px;border-bottom:2px solid #1C1917;">Qty</th>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:right;padding-bottom:12px;border-bottom:2px solid #1C1917;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="background:#F0EBE3;padding:20px;margin-bottom:32px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;color:#9A8F82;">Subtotal</span>
                <span style="font-size:13px;color:#1C1917;">Rp ${Number(subtotal).toLocaleString("id-ID")}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;color:#9A8F82;">Ongkir (${courierName})</span>
                <span style="font-size:13px;color:#1C1917;">${shippingCost === 0 && rawShipping > 0 ? "GRATIS" : "Rp " + Number(shippingCost).toLocaleString("id-ID")}</span>
              </div>
              ${
                memberDiscount > 0
                  ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;color:#2E7D32;">Diskon Member</span>
                <span style="font-size:13px;color:#2E7D32;">- Rp ${memberDiscount.toLocaleString("id-ID")}</span>
              </div>`
                  : ""
              }
              ${
                voucherDiscount > 0
                  ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;color:#2E7D32;">Voucher (${voucherCode})</span>
                <span style="font-size:13px;color:#2E7D32;">- Rp ${voucherDiscount.toLocaleString("id-ID")}</span>
              </div>`
                  : ""
              }
              <div style="display:flex;justify-content:space-between;margin-top:8px;">
                <span style="font-size:15px;font-weight:600;color:#1C1917;">Total</span>
                <span style="font-size:15px;font-weight:600;color:#1C1917;">Rp ${Number(total).toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${trackUrl}" style="display:inline-block;background:#1C1917;color:#FAF8F4;padding:14px 32px;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">Lihat Pesanan</a>
            </div>
            <div style="border-top:1px solid #E8E0D5;margin-top:32px;padding-top:24px;text-align:center;">
              <p style="font-size:10px;color:#C8B89A;letter-spacing:2px;">HENIMA SIGNATURE SCENT · MADE IN INDONESIA</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({
    orderId,
    accessToken,
    memberDiscount,
    voucherDiscount,
    shippingCost,
    subtotal,
    total,
  });
}
