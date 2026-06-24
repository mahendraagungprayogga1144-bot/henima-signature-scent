import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since") || new Date(Date.now() - 60000).toISOString();

  const { data: orders } = await supabase
    .from("retail_orders")
    .select("id, status, total, customer, created_at")
    .eq("status", "pending_payment")
    .gt("created_at", since)
    .order("created_at", { ascending: false });

  return NextResponse.json({ orders: orders || [] });
}
