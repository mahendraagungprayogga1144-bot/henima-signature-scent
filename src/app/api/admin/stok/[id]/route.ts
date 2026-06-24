import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { stock } = await request.json();

  const { error } = await supabase
    .from("products")
    .update({ stock })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Kirim notif WA ke admin kalau stok hampir habis
  if (stock <= 10) {
    const { data: product } = await supabase.from("products").select("name").eq("id", id).single();
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": process.env.FONNTE_TOKEN || "", "Content-Type": "application/json" },
      body: JSON.stringify({
        target: process.env.ADMIN_WHATSAPP || "6285190311230",
        message: `⚠️ *Stok Hampir Habis!*

Produk: ${product?.name}
Sisa stok: ${stock} unit

Segera tambah stok!`,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
