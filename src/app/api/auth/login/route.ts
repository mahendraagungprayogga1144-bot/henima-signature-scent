import { NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/masuk?error=${encodeURIComponent("Email dan kata sandi wajib diisi")}`, request.url)
    );
  }

  const db = await getDatabase();
  const user = db.users.find((u) => u.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.redirect(
      new URL(`/masuk?error=${encodeURIComponent("Email atau kata sandi salah")}`, request.url)
    );
  }

  await setSessionCookie(user.id);
  const dest = user.role === "admin" ? "/admin" : "/katalog";
  return NextResponse.redirect(new URL(dest, request.url));
}
