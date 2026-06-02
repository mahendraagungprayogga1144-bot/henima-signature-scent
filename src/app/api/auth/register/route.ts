import { NextResponse } from "next/server";
import { hashPassword, generateId, setSessionCookie } from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const phone = String(form.get("phone") || "").trim();
  const storeName = String(form.get("storeName") || "").trim();
  const address = String(form.get("address") || "").trim();

  if (!name || !email || !password || !phone || !storeName) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Semua field wajib diisi")}`, request.url)
    );
  }

  if (password.length < 6) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Kata sandi minimal 6 karakter")}`, request.url)
    );
  }

  const db = await getDatabase();
  if (db.users.some((u) => u.email === email)) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Email sudah terdaftar")}`, request.url)
    );
  }

  const userId = generateId("user");
  await updateDatabase((data) => {
    data.users.push({
      id: userId,
      email,
      passwordHash: hashPassword(password),
      name,
      phone,
      role: "reseller",
      storeName,
      address: address || undefined,
      createdAt: new Date().toISOString(),
    });
  });

  await setSessionCookie(userId);
  return NextResponse.redirect(new URL("/katalog", request.url));
}
