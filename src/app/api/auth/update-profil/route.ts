import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/masuk", request.url));

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (!name || !email) {
    return NextResponse.redirect(
      new URL(`/edit-profil?error=${encodeURIComponent("Nama dan email wajib diisi")}`, request.url)
    );
  }

  await updateDatabase((db: any) => {
    const u = db.users.find((u: any) => u.id === user.id);
    if (!u) return;
    u.name = name;
    u.phone = phone;
    u.email = email;
    if (password && password.length >= 6) {
      u.passwordHash = hashPassword(password);
    }
  });

  return NextResponse.redirect(new URL("/edit-profil?success=true", request.url));
}
