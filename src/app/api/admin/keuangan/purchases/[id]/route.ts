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
  const { tanggal, nama, qty, satuan, harga_satuan, supplier } = body;
  const total = Number(qty) * Number(harga_satuan);
  const catatan = `${nama} ${qty} ${satuan}${supplier ? ` (${supplier})` : ""}`;

  const { data: existing } = await supabase
    .from("purchases")
    .select("kas_transaction_id")
    .eq("id", id)
    .single();

  const { data: purchase, error } = await supabase
    .from("purchases")
    .update({
      tanggal,
      nama,
      qty: Number(qty),
      satuan: satuan || "pcs",
      harga_satuan: Number(harga_satuan),
      total,
      supplier: supplier || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let kasTransaction = null;
  if (existing?.kas_transaction_id) {
    const { data: kas } = await supabase
      .from("kas_transactions")
      .update({
        tanggal,
        nominal: total,
        catatan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.kas_transaction_id)
      .select()
      .single();
    kasTransaction = kas;
  }

  return NextResponse.json({ ok: true, purchase, kasTransaction });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: purchase } = await supabase
    .from("purchases")
    .select("kas_transaction_id")
    .eq("id", id)
    .single();

  if (purchase?.kas_transaction_id) {
    await supabase.from("kas_transactions").delete().eq("id", purchase.kas_transaction_id);
  }

  const { error } = await supabase.from("purchases").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, deletedKasId: purchase?.kas_transaction_id || null });
}
