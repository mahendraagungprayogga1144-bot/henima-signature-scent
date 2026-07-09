import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { updateDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const action = form.get("action") as string;

  if (action === "upload") {
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `catalog-${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from("brand-assets")
      .upload(`catalog/${filename}`, Buffer.from(bytes), {
        contentType: file.type,
        upsert: true,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: urlData } = supabase.storage
      .from("brand-assets")
      .getPublicUrl(`catalog/${filename}`);

    return NextResponse.json({ url: urlData.publicUrl });
  }

  if (action === "save") {
    const images = JSON.parse(form.get("images") as string || "[]");
    const heroImage = form.get("heroImage") as string || "";
    const pdfUrl = form.get("pdfUrl") as string || "";
    const title = form.get("title") as string || "Katalog Produk";

    const { error } = await supabase
      .from("settings")
      .update({ catalog: { images, heroImage, pdfUrl, title } })
      .eq("id", 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const url = form.get("url") as string;
    await updateDatabase((db) => {
      const catalog = (db.settings as any).catalog;
      if (catalog) {
        catalog.images = catalog.images.filter((img: string) => img !== url);
      }
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
