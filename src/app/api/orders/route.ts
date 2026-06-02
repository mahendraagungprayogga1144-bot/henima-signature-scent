import { NextResponse } from "next/server";
import { generateId } from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { OrderItem } from "@/lib/types";
import { notifyAdminNewOrder } from "@/lib/notifications";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "reseller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const items = body.items as {
    productId: string;
    variantId?: string;
    sizeMl?: 30 | 50 | 100;
    quantity: number;
  }[];
  const shipping = body.shipping as
    | {
        fullName?: string;
        phone?: string;
        address?: string;
        city?: string;
        province?: string;
        postalCode?: string;
      }
    | undefined;
  const shippingAddress = String(shipping?.address || user.address || "").trim();
  const notes = body.notes ? String(body.notes) : undefined;

  if (!items?.length || !shippingAddress) {
    return NextResponse.json(
      { error: "Item dan alamat pengiriman wajib diisi" },
      { status: 400 }
    );
  }

  const orderType = body.orderType === "satuan" ? "satuan" : "reseller";
  const totalItems = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  if (orderType === "reseller" && totalItems < 3) {
    return NextResponse.json(
      { error: "Minimal 3 pcs untuk pesanan reseller (grosir)" },
      { status: 400 }
    );
  }

  const db = await getDatabase();
  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const product = db.products.find(
      (p) => p.id === item.productId && p.active
    );
    if (!product || item.quantity < 1) {
      return NextResponse.json(
        { error: `Produk tidak valid: ${item.productId}` },
        { status: 400 }
      );
    }
    const fallbackVariant =
      product.variants.find((v) => v.active && v.sizeMl === 50) ||
      product.variants.find((v) => v.active) ||
      product.variants[0];
    const variant =
      product.variants.find((v) => v.id === item.variantId) || fallbackVariant;
    if (!variant) {
      return NextResponse.json(
        { error: `Varian tidak valid: ${item.productId}` },
        { status: 400 }
      );
    }
    const unitPrice =
      orderType === "reseller" ? variant.discountPrice : variant.originalPrice;
    const subtotal = unitPrice * item.quantity;
    orderItems.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      sizeMl: variant.sizeMl,
      quantity: item.quantity,
      unitPrice,
      subtotal,
    });
    total += subtotal;
  }

  const orderId = generateId("ord");
  const now = new Date().toISOString();

  try {
    await updateDatabase((data) => {
      // atomic stock reduction + order creation
      for (const item of orderItems) {
        const p = data.products.find((x) => x.id === item.productId);
        const v = p?.variants.find((vv) => vv.id === item.variantId);
        if (!p || !v || !p.active || !v.active) {
          throw new Error(`Produk/varian tidak valid: ${item.productId}`);
        }
        if (v.stock < item.quantity) {
          throw new Error(
            `Stok tidak cukup untuk ${p.name} ${item.sizeMl}ml (tersisa ${v.stock})`
          );
        }
      }

      for (const item of orderItems) {
        const p = data.products.find((x) => x.id === item.productId)!;
        const v = p.variants.find((vv) => vv.id === item.variantId)!;
        v.stock -= item.quantity;
      }

      data.orders.push({
      id: orderId,
      resellerId: user.id,
      resellerName: user.name,
      resellerPhone: user.phone,
      storeName: user.storeName,
      orderType,
      shipping: {
        fullName: String(shipping?.fullName || user.name || ""),
        phone: String(shipping?.phone || user.phone || ""),
        address: shippingAddress,
        city: String(shipping?.city || ""),
        province: String(shipping?.province || ""),
        postalCode: String(shipping?.postalCode || ""),
      },
      courier:
        body.courier === "jne" ||
        body.courier === "jnt" ||
        body.courier === "sicepat" ||
        body.courier === "anteraja"
          ? body.courier
          : "jne",
      items: orderItems,
      total,
      status: "pending_payment",
      statusHistory: [{ status: "pending_payment", at: now }],
      notes,
      createdAt: now,
      updatedAt: now,
    });
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal membuat pesanan";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Best-effort notifications (do not block checkout on provider failures)
  try {
    const latest = await getDatabase();
    const order = latest.orders.find((o) => o.id === orderId);
    if (order) await notifyAdminNewOrder({ db: latest, order });
  } catch {
    // ignore
  }

  return NextResponse.json({ orderId });
}
