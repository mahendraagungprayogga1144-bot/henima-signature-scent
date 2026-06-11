import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { Resend } from "resend";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { subject, body } = await request.json();
  if (!subject || !body) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: subscribers } = await supabase.from("subscribers").select("email");
  if (!subscribers || subscribers.length === 0) return NextResponse.json({ error: "No subscribers" }, { status: 400 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;

  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: "Henima Signature Scent <noreply@henimaofficial.com>",
        to: sub.email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family:Georgia,serif;background:#FAF8F4;margin:0;padding:0;">
            <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
              <div style="text-align:center;margin-bottom:40px;">
                <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:8px;color:#1C1917;margin:0;">HENIMA</h1>
                <p style="font-size:10px;letter-spacing:3px;color:#9A8F82;text-transform:uppercase;margin-top:4px;">Signature Scent</p>
              </div>
              <div style="border-top:1px solid #E8E0D5;padding-top:32px;">
                <h2 style="font-size:20px;font-weight:400;color:#1C1917;margin-bottom:24px;">${subject}</h2>
                <div style="font-size:14px;color:#4A4440;line-height:1.9;white-space:pre-line;">${body}</div>
              </div>
              <div style="border-top:1px solid #E8E0D5;margin-top:40px;padding-top:24px;text-align:center;">
                <a href="https://henimaofficial.com/shop" style="display:inline-block;background:#1C1917;color:#FAF8F4;padding:14px 32px;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;margin-bottom:24px;">Shop Now</a>
                <p style="font-size:10px;color:#C8B89A;letter-spacing:2px;">HENIMA SIGNATURE SCENT · MADE IN INDONESIA</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      sent++;
    } catch (e) {
      console.error("Failed to send to:", sub.email, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
