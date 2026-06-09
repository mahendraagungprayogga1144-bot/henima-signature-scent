import { NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const password = String(form.get("password") || "");
  const confirm = String(form.get("confirm") || "");

  if (!token || !password) {
    return NextResponse.redirect(
      new URL(`/lupa-sandi?error=${encodeURIComponent("Link tidak valid")}`, request.url)
    );
  }

  if (password !== confirm) {
    return NextResponse.redirect(
      new URL(`/reset-password?token=${token}&error=${encodeURIComponent("Kata sandi tidak cocok")}`, request.url)
    );
  }

  if (password.length < 6) {
    return NextResponse.redirect(
      new URL(`/reset-password?token=${token}&error=${encodeURIComponent("Minimal 6 karakter")}`, request.url)
    );
  }

  const db = await getDatabase();
  const user = db.users.find((u: any) => u.resetToken === token);

  if (!user) {
    return NextResponse.redirect(
      new URL(`/lupa-sandi?error=${encodeURIComponent("Link tidak valid atau sudah expired")}`, request.url)
    );
  }

  if (new Date(user.resetTokenExpiry) < new Date()) {
    return NextResponse.redirect(
      new URL(`/lupa-sandi?error=${encodeURIComponent("Link sudah expired, minta reset ulang")}`, request.url)
    );
  }

  await updateDatabase((db: any) => {
    const u = db.users.find((u: any) => u.resetToken === token);
    if (u) {
      u.passwordHash = hashPassword(password);
      u.resetToken = null;
      u.resetTokenExpiry = null;
    }
  });

  await setSessionCookie(user.id);
  return NextResponse.redirect(new URL("/profil", request.url));
}