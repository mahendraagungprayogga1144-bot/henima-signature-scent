import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { normalizeInputs } from "@/lib/hpp-calculator";

type MaterialRow = {
  id: string;
  name: string;
  qty: number;
  unit: string;
};

function findByKeywords(rows: MaterialRow[], keywords: string[]): MaterialRow | undefined {
  return rows.find((m) => {
    const n = m.name.toLowerCase();
    return keywords.some((k) => n.includes(k));
  });
}

/**
 * Catat produksi batch: kurangi stok bahan (botol, box, bibit)
 * sesuai qty batch × formula HPP kalkulator.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const batch = Number(body.batch) === 2 ? 2 : 1;

  const { data: product, error: pErr } = await supabase
    .from("hpp_calculator_products")
    .select("*")
    .eq("id", id)
    .single();

  if (pErr || !product) {
    return NextResponse.json({ error: "Produk HPP tidak ditemukan" }, { status: 404 });
  }

  const inputs = normalizeInputs(product.inputs);
  const qty =
    body.qty !== undefined && body.qty !== null && body.qty !== ""
      ? Math.max(0, Math.trunc(Number(body.qty) || 0))
      : batch === 2
        ? Math.trunc(inputs.batch2Qty)
        : Math.trunc(inputs.batch1Qty);

  if (qty <= 0) {
    return NextResponse.json({ error: "Qty produksi harus > 0" }, { status: 400 });
  }

  const bibitMl = qty * inputs.bibitPerBotol;

  const { data: materials, error: mErr } = await supabase
    .from("material_stocks")
    .select("*");

  if (mErr) {
    return NextResponse.json({ error: mErr.message }, { status: 500 });
  }

  const rows = (materials || []) as MaterialRow[];
  const botol = findByKeywords(rows, ["botol"]);
  const box = findByKeywords(rows, ["box"]);
  const bibit = findByKeywords(rows, ["bibit"]);

  const deductions: Array<{
    material: MaterialRow;
    delta: number;
    note: string;
  }> = [];

  if (botol) {
    deductions.push({
      material: botol,
      delta: -qty,
      note: `Produksi ${product.name} Batch ${batch} — ${qty} botol`,
    });
  }
  if (box) {
    deductions.push({
      material: box,
      delta: -qty,
      note: `Produksi ${product.name} Batch ${batch} — ${qty} box`,
    });
  }
  if (bibit && bibitMl > 0) {
    deductions.push({
      material: bibit,
      delta: -bibitMl,
      note: `Produksi ${product.name} Batch ${batch} — ${bibitMl} ml bibit`,
    });
  }

  if (deductions.length === 0) {
    return NextResponse.json(
      {
        error:
          "Stok bahan belum ada yang cocok (cari nama mengandung Botol / Box / Bibit). Isi di Admin → Bahan Baku dulu.",
      },
      { status: 400 }
    );
  }

  const warnings: string[] = [];
  const updated: Array<{ id: string; name: string; qtyBefore: number; qtyAfter: number }> = [];

  for (const d of deductions) {
    const before = Number(d.material.qty) || 0;
    const after = before + d.delta;
    if (after < 0) {
      warnings.push(
        `${d.material.name}: stok ${before} kurang untuk potong ${Math.abs(d.delta)} (hasil ${after})`
      );
    }

    const { error: uErr } = await supabase
      .from("material_stocks")
      .update({ qty: after, updated_at: new Date().toISOString() })
      .eq("id", d.material.id);

    if (uErr) {
      return NextResponse.json({ error: uErr.message }, { status: 500 });
    }

    await supabase.from("material_movements").insert({
      material_id: d.material.id,
      jenis: "keluar",
      qty: Math.abs(d.delta),
      catatan: d.note,
    });

    updated.push({
      id: d.material.id,
      name: d.material.name,
      qtyBefore: before,
      qtyAfter: after,
    });
  }

  return NextResponse.json({
    ok: true,
    batch,
    qty,
    bibitMl,
    updated,
    warnings,
    missing: {
      botol: !botol,
      box: !box,
      bibit: !bibit,
    },
  });
}
