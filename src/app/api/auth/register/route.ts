import { NextResponse } from "next/server";
import { hashPassword, generateId, setSessionCookie } from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const firstName = String(form.get("firstName") || "").trim();
  const lastName = String(form.get("lastName") || "").trim();
  const name = `${firstName} ${lastName}`.trim() || String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const phone = String(form.get("phone") || "").trim();
  const city = String(form.get("city") || "").trim();
  const occupation = String(form.get("occupation") || "").trim();
  const birthPlace = String(form.get("birthPlace") || "").trim();
  const birthDate = String(form.get("birthDate") || "").trim();
  const gender = String(form.get("gender") || "").trim();

  if (!name || !email || !password || !phone) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Nama, email, password, dan WhatsApp wajib diisi")}`, request.url)
    );
  }

  if (password.length < 6) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Password minimal 6 karakter")}`, request.url)
    );
  }

  const db = await getDatabase();
  if (db.users.some((u: any) => u.email === email)) {
    return NextResponse.redirect(
      new URL(`/daftar?error=${encodeURIComponent("Email sudah terdaftar")}`, request.url)
    );
  }

  const userId = generateId("user");
  await updateDatabase((data: any) => {
    data.users.push({
      id: userId,
      email,
      passwordHash: hashPassword(password),
      name,
      phone,
      role: "member",
      storeName: "Member",
      city,
      occupation,
      birthPlace,
      birthDate,
      gender,
      reseller: {
        approved: true,
        tier: "Bronze",
        commissionPct: 0,
        commissionEarned: 0,
      },
      createdAt: new Date().toISOString(),
    });
  });

  await setSessionCookie(userId);
  return NextResponse.redirect(new URL("/", request.url));
}
