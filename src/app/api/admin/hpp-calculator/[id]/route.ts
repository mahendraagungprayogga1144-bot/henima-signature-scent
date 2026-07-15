import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { normalizeInputs, slugifyName } from "@/lib/hpp-calculator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.name !== undefined) {
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Nama produk tidak boleh kosong" }, { status: 400 });
    }
    updates.name = name;
    if (body.updateSlug) {
      updates.slug = slugifyName(name);
    }
  }

  if (body.inputs !== undefined) {
    updates.inputs = normalizeInputs(body.inputs);
  }

  if (body.sort_order !== undefined) {
    updates.sort_order = Number(body.sort_order) || 0;
  }

  const { data, error } = await supabase
    .from("hpp_calculator_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    product: { ...data, inputs: normalizeInputs(data.inputs) },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("hpp_calculator_products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
