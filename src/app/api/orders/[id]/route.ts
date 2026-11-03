import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import {
  phonesMatch,
  redactOrder,
  verifyOrderAccessToken,
} from "@/lib/order-access";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  if (!rateLimit(`order-get:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan" }, { status: 429 });
  }

  const { id } = await params;
  const url = new URL(request.url);
  const token = url.searchParams.get("t") || url.searchParams.get("token");
  const phone = url.searchParams.get("phone") || "";

  const { data, error } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  const isOwner = user && data.user_id && user.id === data.user_id;
  const customer = (typeof data.customer === "string"
    ? JSON.parse(data.customer)
    : data.customer) as { phone?: string } | null;
  const tokenOk = verifyOrderAccessToken(token, id);
  const phoneOk = phone && customer?.phone ? phonesMatch(phone, customer.phone) : false;

  if (!isAdmin && !isOwner && !tokenOk && !phoneOk) {
    return NextResponse.json(redactOrder(data as Record<string, unknown>), { status: 401 });
  }

  return NextResponse.json(data);
}
