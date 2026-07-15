import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ purchases: data || [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { tanggal, nama, qty, satuan, harga_satuan, supplier, masuk_kas, kategori_kas, po_status, expected_date, po_notes } = body;

  if (!tanggal || !nama || !qty || !harga_satuan) {
    return NextResponse.json({ error: "Tanggal, nama, qty, dan harga wajib diisi" }, { status: 400 });
  }

  const total = Number(qty) * Number(harga_satuan);
  const catatan = `${nama} ${qty} ${satuan}${supplier ? ` (${supplier})` : ""}`;
  const status = ["draft", "ordered", "received", "cancelled"].includes(po_status)
    ? po_status
    : "ordered";

  let kasTransactionId: string | null = null;
  let purchaseId: string | null = null;

  if (masuk_kas) {
    const { data: kasData, error: kasError } = await supabase
      .from("kas_transactions")
      .insert({
        jenis: "keluar",
        tanggal,
        kategori: kategori_kas || "Pembelian Pabrik",
        catatan,
        nominal: total,
      })
      .select()
      .single();

    if (kasError) return NextResponse.json({ error: kasError.message }, { status: 500 });
    kasTransactionId = kasData.id;
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      tanggal,
      nama,
      qty: Number(qty),
      satuan: satuan || "pcs",
      harga_satuan: Number(harga_satuan),
      total,
      supplier: supplier || "",
      kas_transaction_id: kasTransactionId,
      po_status: status,
      expected_date: expected_date || null,
      po_notes: po_notes || "",
    })
    .select()
    .single();

  if (purchaseError) {
    if (kasTransactionId) await supabase.from("kas_transactions").delete().eq("id", kasTransactionId);
    return NextResponse.json({ error: purchaseError.message }, { status: 500 });
  }

  purchaseId = purchase.id;

  if (kasTransactionId) {
    await supabase
      .from("kas_transactions")
      .update({ purchase_id: purchaseId, updated_at: new Date().toISOString() })
      .eq("id", kasTransactionId);
  }

  const { data: kasLinked } = kasTransactionId
    ? await supabase.from("kas_transactions").select("*").eq("id", kasTransactionId).single()
    : { data: null };

  return NextResponse.json({ ok: true, purchase, kasTransaction: kasLinked });
}
