import os

# Broadcast page
with open("src/app/admin/broadcast/page.tsx", "w") as f:
    f.write('''import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BroadcastForm from "./BroadcastForm";

export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: subscribers, count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Broadcast Email</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>Kirim email ke {count || 0} subscriber</p>

      {/* Subscriber list */}
      <div style={{ background: "#f9f9f9", border: "1px solid #e5e5e5", padding: "20px", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Daftar Subscriber ({count || 0})</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
          {subscribers?.map(s => (
            <span key={s.id} style={{ fontSize: "12px", background: "#fff", border: "1px solid #e0e0e0", padding: "4px 10px", color: "#555" }}>
              {s.email}
            </span>
          ))}
        </div>
      </div>

      <BroadcastForm subscriberCount={count || 0} />
    </div>
  );
}
''')
print("Page Done!")

# BroadcastForm component
with open("src/app/admin/broadcast/BroadcastForm.tsx", "w") as f:
    f.write('''"use client";
import { useState } from "react";

export default function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  async function send() {
    if (!subject.trim() || !body.trim()) { setMsg("Subject dan isi email wajib diisi!"); return; }
    if (!confirm(`Kirim email ke ${subscriberCount} subscriber?`)) return;
    setSending(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`Berhasil kirim ke ${data.sent} subscriber!`);
        setSubject("");
        setBody("");
      } else {
        setMsg("Gagal: " + data.error);
      }
    } catch { setMsg("Terjadi kesalahan"); }
    finally { setSending(false); }
  }

  return (
    <div>
      <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: "24px" }}>Tulis Email Broadcast</p>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)}
          placeholder="contoh: Promo Spesial Henima 🎉"
          style={{ width: "100%", border: "1px solid #e0e0e0", padding: "12px 14px", fontSize: "14px", outline: "none", fontFamily: "var(--font-jost)", boxSizing: "border-box" as const }} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Isi Email</label>
        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder="Tulis isi email di sini... Bisa gunakan Enter untuk paragraf baru."
          rows={10}
          style={{ width: "100%", border: "1px solid #e0e0e0", padding: "12px 14px", fontSize: "14px", outline: "none", fontFamily: "var(--font-jost)", resize: "vertical", boxSizing: "border-box" as const, lineHeight: 1.7 }} />
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={send} disabled={sending || subscriberCount === 0}
          style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "12px 32px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-jost)", opacity: subscriberCount === 0 ? 0.4 : 1 }}>
          {sending ? "Mengirim..." : `Kirim ke ${subscriberCount} Subscriber`}
        </button>
        {msg && <span style={{ fontSize: "13px", color: msg.startsWith("Berhasil") ? "#2E7D32" : "#cc0000" }}>{msg}</span>}
      </div>

      {subscriberCount === 0 && (
        <p style={{ fontSize: "12px", color: "#aaa", marginTop: "12px" }}>Belum ada subscriber.</p>
      )}
    </div>
  );
}
''')
print("Form Done!")

# API broadcast
os.makedirs("src/app/api/admin/broadcast", exist_ok=True)
with open("src/app/api/admin/broadcast/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
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
''')
print("API Done!")
print("All Done!")
