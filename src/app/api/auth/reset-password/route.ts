import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDatabase, updateDatabase } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.redirect(
      new URL(`/lupa-sandi?error=${encodeURIComponent("Email wajib diisi")}`, request.url)
    );
  }

  const db = await getDatabase();
  const user = db.users.find((u: any) => u.email === email);

  if (!user) {
    return NextResponse.redirect(new URL(`/lupa-sandi?sent=true`, request.url));
  }

  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expiry = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  await updateDatabase((db: any) => {
    const u = db.users.find((u: any) => u.email === email);
    if (u) {
      u.resetToken = token;
      u.resetTokenExpiry = expiry;
    }
  });

  const resetUrl = `https://henimaofficial.com/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Henima <noreply@henimaofficial.com>",
    to: email,
    subject: "Reset Kata Sandi - Henima",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
        <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">Reset Kata Sandi</h1>
        <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:32px;">
          Kamu meminta reset kata sandi untuk akun Henima kamu. Link ini berlaku selama <strong>1 jam</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 32px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">
          Reset Kata Sandi
        </a>
        <p style="font-size:12px;color:#aaa;margin-top:32px;">Kalau kamu tidak meminta ini, abaikan email ini.</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;" />
        <p style="font-size:11px;color:#aaa;letter-spacing:2px;text-transform:uppercase;">Henima Signature Scent</p>
      </div>
    `,
  });

  return NextResponse.redirect(new URL(`/lupa-sandi?sent=true`, request.url));
}