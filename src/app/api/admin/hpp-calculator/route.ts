import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { HPP_DEFAULTS, normalizeInputs, slugifyName } from "@/lib/hpp-calculator";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("hpp_calculator_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map((row) => {
    const raw = row.inputs;
    const seller =
      raw && typeof raw === "object" && "sellerChannel" in raw
        ? String((raw as { sellerChannel?: string }).sellerChannel || "")
        : "";
    return {
      ...row,
      inputs: normalizeInputs(raw),
      seller_channel: seller || undefined,
    };
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Nama produk wajib diisi" }, { status: 400 });
  }

  let slug = slugifyName(body.slug || name);
  const { count } = await supabase
    .from("hpp_calculator_products")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  if ((count || 0) > 0) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const { data: maxRow } = await supabase
    .from("hpp_calculator_products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (maxRow?.sort_order ?? -1) + 1;
  const nums = normalizeInputs(body.inputs || HPP_DEFAULTS);
  const sellerChannel = body.sellerChannel || "afiliator";
  const inputs = { ...nums, sellerChannel };

  const { data, error } = await supabase
    .from("hpp_calculator_products")
    .insert({ slug, name, inputs, sort_order })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    product: {
      ...data,
      inputs: normalizeInputs(data.inputs),
      seller_channel:
        typeof data.inputs === "object" && data.inputs && "sellerChannel" in (data.inputs as object)
          ? String((data.inputs as { sellerChannel?: string }).sellerChannel || "afiliator")
          : "afiliator",
    },
  });
}
