import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    items, name, phone, email, address, city, province,
    postalCode, courier, courierName, shippingCost, subtotal, total,
  } = body;

  const orderId = "ORD-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  await updateDatabase((db) => {
    if (!(db as any).retailOrders) (db as any).retailOrders = [];
    (db as any).retailOrders.push({
      id: orderId,
      items,
      customer: { name, phone, email, address, city, province, postalCode },
      courier, courierName, shippingCost, subtotal, total,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ orderId });
}
