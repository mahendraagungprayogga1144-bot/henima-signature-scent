import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { jenis, tanggal, kategori, catatan, nominal } = body;

  const { data, error } = await supabase
    .from("kas_transactions")
    .update({
      jenis,
      tanggal,
      kategori,
      catatan: catatan ?? "",
      nominal: Number(nominal),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, transaction: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: kas } = await supabase
    .from("kas_transactions")
    .select("purchase_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("kas_transactions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (kas?.purchase_id) {
    await supabase
      .from("purchases")
      .update({ kas_transaction_id: null, updated_at: new Date().toISOString() })
      .eq("id", kas.purchase_id);
  }

  return NextResponse.json({ ok: true });
}
