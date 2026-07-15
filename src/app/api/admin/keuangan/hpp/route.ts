import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("hpp_products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data || [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { name, bottles, components } = body;

  if (!name) return NextResponse.json({ error: "Nama produk wajib diisi" }, { status: 400 });

  const { count } = await supabase.from("hpp_products").select("*", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("hpp_products")
    .insert({
      name,
      bottles: bottles ?? 50,
      components: components ?? [{ name: "Bibit parfum", cost: 0 }],
      sort_order: count || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, product: data });
}
