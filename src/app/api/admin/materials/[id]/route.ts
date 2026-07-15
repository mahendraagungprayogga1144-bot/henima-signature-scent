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

  // Adjust stock with movement
  if (body.adjustQty !== undefined) {
    const delta = Number(body.adjustQty) || 0;
    const { data: mat } = await supabase.from("material_stocks").select("*").eq("id", id).single();
    if (!mat) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextQty = Number(mat.qty) + delta;
    const { data, error } = await supabase
      .from("material_stocks")
      .update({ qty: nextQty, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from("material_movements").insert({
      material_id: id,
      jenis: delta >= 0 ? "masuk" : "keluar",
      qty: Math.abs(delta),
      catatan: String(body.catatan || (delta >= 0 ? "Stok masuk" : "Stok keluar / pakai produksi")),
    });

    return NextResponse.json({ material: data });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) updates.name = String(body.name);
  if (body.unit !== undefined) updates.unit = String(body.unit);
  if (body.unit_cost !== undefined) updates.unit_cost = Math.trunc(Number(body.unit_cost) || 0);
  if (body.notes !== undefined) updates.notes = String(body.notes);
  if (body.qty !== undefined) updates.qty = Number(body.qty) || 0;

  const { data, error } = await supabase
    .from("material_stocks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ material: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase.from("material_stocks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
