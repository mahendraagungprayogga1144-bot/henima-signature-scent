import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { DEFAULT_CATEGORIES, type FinanceCategories } from "@/lib/keuangan";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data } = await supabase.from("settings").select("finance_categories").eq("id", 1).single();
  const cats = (data?.finance_categories as FinanceCategories) || DEFAULT_CATEGORIES;
  return NextResponse.json({ categories: cats });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { categories, action, jenis, name } = body;

  if (categories) {
    await supabase.from("settings").update({ finance_categories: categories }).eq("id", 1);
    return NextResponse.json({ ok: true, categories });
  }

  const { data } = await supabase.from("settings").select("finance_categories").eq("id", 1).single();
  const current: FinanceCategories = (data?.finance_categories as FinanceCategories) || { ...DEFAULT_CATEGORIES };

  if (action === "add" && jenis && name) {
    const key = jenis as "masuk" | "keluar";
    if (current[key].includes(name)) {
      return NextResponse.json({ error: "Kategori sudah ada" }, { status: 400 });
    }
    const idx = current[key].indexOf("Lainnya");
    if (idx >= 0) current[key].splice(idx, 0, name);
    else current[key].push(name);
  } else if (action === "remove" && jenis && name) {
    const key = jenis as "masuk" | "keluar";
    current[key] = current[key].filter((k) => k !== name);
  } else if (action === "reset") {
    Object.assign(current, DEFAULT_CATEGORIES);
  } else {
    return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });
  }

  await supabase.from("settings").update({ finance_categories: current }).eq("id", 1);
  return NextResponse.json({ ok: true, categories: current });
}
