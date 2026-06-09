import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    items, name, phone, email, address, city, province,
    postalCode, courier, courierName, shippingCost, subtotal, total,
  } = body;

  const orderId = "ORD-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  const { error } = await supabase.from("retail_orders").insert({
    id: orderId,
    items: items,
    customer: { name, phone, email, address, city, province, postalCode },
    courier,
    courier_name: courierName,
    shipping_cost: shippingCost,
    subtotal,
    total,
    status: "pending_payment",
  });

  if (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orderId });
}
