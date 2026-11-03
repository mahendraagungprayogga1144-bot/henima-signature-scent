import { NextResponse } from "next/server";
import {
  verifyPassword,
  setSessionCookie,
  needsPasswordRehash,
  hashPassword,
} from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`login:${ip}`, 8, 60_000)) {
    return NextResponse.redirect(
      new URL(
        `/masuk?error=${encodeURIComponent("Terlalu banyak percobaan. Coba lagi nanti.")}`,
        request.url
      )
    );
  }

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

    // Upgrade legacy SHA256 hashes to bcrypt after successful login
    if (needsPasswordRehash(user.passwordHash)) {
      try {
        const newHash = hashPassword(password);
        await updateDatabase((data) => {
          const u = data.users.find((x) => x.id === user.id);
          if (u) u.passwordHash = newHash;
        });
      } catch (e) {
        console.error("Password rehash failed:", e);
      }
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
