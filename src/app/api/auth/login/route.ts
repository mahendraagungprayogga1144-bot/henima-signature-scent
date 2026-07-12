import { NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const remember = String(form.get("remember") || "") === "on";

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(
        `/masuk?error=${encodeURIComponent("Email dan kata sandi wajib diisi")}`,
        request.url
      )
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.redirect(
      new URL(
        `/masuk?error=${encodeURIComponent("Format email tidak valid")}`,
        request.url
      )
    );
  }

  try {
    const db = await getDatabase();
    const user = db.users.find((u) => u.email === email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.redirect(
        new URL(
          `/masuk?error=${encodeURIComponent("Email atau kata sandi salah")}`,
          request.url
        )
      );
    }

    await setSessionCookie(user.id, remember);
    const dest = user.role === "admin" ? "/admin" : "/profil";
    return NextResponse.redirect(new URL(dest, request.url));
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.redirect(
      new URL(
        `/masuk?error=${encodeURIComponent("Terjadi kesalahan. Coba lagi nanti.")}`,
        request.url
      )
    );
  }
}
