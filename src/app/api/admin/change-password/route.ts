import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { updateDatabase } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
  }

  // Verify current password
  const { data: userData } = await supabase
    .from("users")
    .select("password_hash")
    .eq("id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(currentPassword, userData.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Password lama tidak benar" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await supabase
    .from("users")
    .update({ password_hash: newHash })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
