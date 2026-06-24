import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("flash_sales")
    .select("*")
    .eq("active", true)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("created_at", { ascending: false });
  return NextResponse.json(data || []);
}
