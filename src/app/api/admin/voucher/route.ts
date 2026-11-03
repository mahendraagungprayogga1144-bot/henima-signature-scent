import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

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
