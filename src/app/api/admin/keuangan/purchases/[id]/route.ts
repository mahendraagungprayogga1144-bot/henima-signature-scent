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
  const { tanggal, nama, qty, satuan, harga_satuan, supplier, po_status, expected_date, po_notes } = body;
  const total = Number(qty) * Number(harga_satuan);
  const catatan = `${nama} ${qty} ${satuan}${supplier ? ` (${supplier})` : ""}`;

  const { data: existing } = await supabase
    .from("purchases")
    .select("kas_transaction_id, po_status")
    .eq("id", id)
    .single();

  const updates: Record<string, unknown> = {
    tanggal,
    nama,
    qty: Number(qty),
    satuan: satuan || "pcs",
    harga_satuan: Number(harga_satuan),
    total,
    supplier: supplier || "",
    updated_at: new Date().toISOString(),
  };
  if (po_status && ["draft", "ordered", "received", "cancelled"].includes(po_status)) {
    updates.po_status = po_status;
  }
  if (expected_date !== undefined) updates.expected_date = expected_date || null;
  if (po_notes !== undefined) updates.po_notes = po_notes || "";

  const { data: purchase, error } = await supabase
    .from("purchases")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Saat PO jadi "received" pertama kali → coba tambah stok bahan yang namanya cocok
  let stockSynced: { name: string; qtyAfter: number } | null = null;
  if (
    po_status === "received" &&
    existing?.po_status !== "received" &&
    purchase
  ) {
    try {
      const { data: mats } = await supabase.from("material_stocks").select("*");
      const namaLower = String(nama || "").toLowerCase();
      const match = (mats || []).find((m: { name: string }) => {
        const mn = m.name.toLowerCase();
        return (
          (namaLower.includes("botol") && mn.includes("botol")) ||
          (namaLower.includes("box") && mn.includes("box")) ||
          (namaLower.includes("bibit") && mn.includes("bibit")) ||
          mn.includes(namaLower.slice(0, 12))
        );
      });
      if (match) {
        const after = Number(match.qty) + Number(qty);
        await supabase
          .from("material_stocks")
          .update({ qty: after, updated_at: new Date().toISOString() })
          .eq("id", match.id);
        await supabase.from("material_movements").insert({
          material_id: match.id,
          jenis: "masuk",
          qty: Number(qty),
          catatan: `PO diterima: ${nama} (#${id.slice(0, 8)})`,
        });
        stockSynced = { name: match.name, qtyAfter: after };
      }
    } catch (e) {
      console.error("PO stock sync failed:", e);
    }
  }

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

  return NextResponse.json({ ok: true, purchase, kasTransaction, stockSynced });
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
