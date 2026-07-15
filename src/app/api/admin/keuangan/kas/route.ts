import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("kas_transactions")
    .select("*")
    .order("tanggal", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ transactions: data || [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { jenis, tanggal, kategori, catatan, nominal } = body;

  if (!jenis || !tanggal || !kategori || !nominal) {
    return NextResponse.json({ error: "Tanggal, kategori, dan nominal wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("kas_transactions")
    .insert({
      jenis,
      tanggal,
      kategori,
      catatan: catatan || "",
      nominal: Number(nominal),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, transaction: data });
}
