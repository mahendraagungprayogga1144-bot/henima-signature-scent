import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { code, type, value, min_order, max_uses, expires_at } = body;

  if (!code || !type) return NextResponse.json({ error: "Kode dan tipe wajib diisi" }, { status: 400 });

  const { data, error } = await supabase
    .from("vouchers")
    .insert({ code, type, value: value || 0, min_order: min_order || 0, max_uses: max_uses || 100, expires_at })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, voucher: data });
}
