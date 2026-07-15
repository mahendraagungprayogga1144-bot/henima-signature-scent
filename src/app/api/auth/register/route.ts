import { NextResponse } from "next/server";
import { hashPassword, generateId, setSessionCookie } from "@/lib/auth";
import { getDatabase, updateDatabase } from "@/lib/db";
import {
  applyReferralOnSignup,
  getOrCreateMemberProfile,
} from "@/lib/membership";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const firstName = String(form.get("firstName") || "").trim();
  const lastName = String(form.get("lastName") || "").trim();
  const name =
    `${firstName} ${lastName}`.trim() || String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const confirmPassword = String(form.get("confirmPassword") || "");
  const phone = String(form.get("phone") || "").trim();
  const city = String(form.get("city") || "").trim();
  const occupation = String(form.get("occupation") || "").trim();
  const birthPlace = String(form.get("birthPlace") || "").trim();
  const birthDate = String(form.get("birthDate") || "").trim();
  const gender = String(form.get("gender") || "").trim();
  const referralCode = String(form.get("referralCode") || "").trim();

  if (!firstName || !lastName || !email || !password || !phone) {
    return NextResponse.redirect(
      new URL(
        `/daftar?error=${encodeURIComponent("Nama depan, nama belakang, email, password, dan WhatsApp wajib diisi")}`,
        request.url
      )
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.redirect(
      new URL(
        `/daftar?error=${encodeURIComponent("Format email tidak valid")}`,
        request.url
      )
    );
  }

  if (password.length < 8) {
    return NextResponse.redirect(
      new URL(
        `/daftar?error=${encodeURIComponent("Password minimal 8 karakter")}`,
        request.url
      )
    );
  }

  if (confirmPassword && password !== confirmPassword) {
    return NextResponse.redirect(
      new URL(
        `/daftar?error=${encodeURIComponent("Konfirmasi password tidak cocok")}`,
        request.url
      )
    );
  }

  try {
    const db = await getDatabase();
    if (db.users.some((u: { email: string }) => u.email === email)) {
      return NextResponse.redirect(
        new URL(
          `/daftar?error=${encodeURIComponent("Email sudah terdaftar")}`,
          request.url
        )
      );
    }

    const userId = generateId("user");
    await updateDatabase((data: { users: unknown[] }) => {
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

    try {
      await getOrCreateMemberProfile(userId);
      if (referralCode) {
        await applyReferralOnSignup(userId, referralCode);
      }
    } catch (e) {
      console.error("member_profiles / referral failed:", e);
    }

    await setSessionCookie(userId);
    return NextResponse.redirect(new URL("/profil", request.url));
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.redirect(
      new URL(
        `/daftar?error=${encodeURIComponent("Gagal mendaftar. Coba lagi nanti.")}`,
        request.url
      )
    );
  }
}
