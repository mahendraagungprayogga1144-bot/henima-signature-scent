import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const images = JSON.parse(form.get("images") as string || "[]");
  const title = form.get("title") as string || "Galeri";

  const { error } = await supabase.from("settings").update({ gallery: { images, title } }).eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
