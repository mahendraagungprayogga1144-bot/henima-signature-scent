# Update SubscribeForm - tambah field nama dan nomor HP
with open("src/components/SubscribeForm.tsx", "w") as f:
    f.write('''"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  async function subscribe() {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Thank you for subscribing!");
        setEmail(""); setName(""); setPhone("");
      } else {
        setStatus("error");
        setMsg(data.error || "Terjadi kesalahan");
      }
    } catch {
      setStatus("error");
      setMsg("Terjadi kesalahan");
    }
  }

  if (status === "success") {
    return (
      <p style={{fontSize:"13px", color:"rgba(200,184,154,0.8)", fontFamily:"var(--font-jost)", fontWeight:300, padding:"13px 0"}}>
        {msg}
      </p>
    );
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        style={{background:"transparent", border:"1px solid rgba(255,255,255,0.15)", padding:"12px 16px", fontSize:"13px", color:"#F0EBE3", fontFamily:"var(--font-jost)", outline:"none"}}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email address"
        style={{background:"transparent", border:"1px solid rgba(255,255,255,0.15)", padding:"12px 16px", fontSize:"13px", color:"#F0EBE3", fontFamily:"var(--font-jost)", outline:"none"}}
      />
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="WhatsApp number (08xx)"
        style={{background:"transparent", border:"1px solid rgba(255,255,255,0.15)", padding:"12px 16px", fontSize:"13px", color:"#F0EBE3", fontFamily:"var(--font-jost)", outline:"none"}}
      />
      <button
        onClick={subscribe}
        disabled={status === "loading"}
        style={{background:"#F0EBE3", border:"1px solid #F0EBE3", color:"#1C1917", padding:"13px 20px", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"var(--font-jost)", cursor:"pointer", fontWeight:500}}>
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p style={{fontSize:"11px", color:"rgba(200,100,100,0.8)", fontFamily:"var(--font-jost)"}}>{msg}</p>
      )}
    </div>
  );
}
''')
print("SubscribeForm Done!")

# Update API subscribe - terima name dan phone
with open("src/app/api/subscribe/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, name, phone } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  const { error } = await supabase.from("subscribers").upsert(
    { email, name: name || null, phone: phone || null },
    { onConflict: "email", ignoreDuplicates: false }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
''')
print("API Subscribe Done!")

# Update broadcast page - tambah WA blast
import os
with open("src/app/admin/broadcast/BroadcastForm.tsx", "w") as f:
    f.write('''"use client";
import { useState } from "react";

export default function BroadcastForm({ subscriberCount, waCount }: { subscriberCount: number, waCount: number }) {
  const [tab, setTab] = useState<"email"|"wa">("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  async function send() {
    if (!body.trim()) { setMsg("Isi pesan wajib diisi!"); return; }
    if (tab === "email" && !subject.trim()) { setMsg("Subject wajib diisi!"); return; }
    const count = tab === "email" ? subscriberCount : waCount;
    if (!confirm(`Kirim ${tab === "email" ? "email" : "WA"} ke ${count} subscriber?`)) return;
    setSending(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/${tab === "email" ? "broadcast" : "wa-blast"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`Berhasil kirim ke ${data.sent} subscriber!`);
        setSubject(""); setBody("");
      } else {
        setMsg("Gagal: " + data.error);
      }
    } catch { setMsg("Terjadi kesalahan"); }
    finally { setSending(false); }
  }

  return (
    <div>
      {/* Tab */}
      <div style={{display:"flex", gap:"0", marginBottom:"32px", borderBottom:"1px solid #e5e5e5"}}>
        {[["email","📧 Email Blast"],["wa","💬 WA Blast"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)}
            style={{padding:"12px 24px", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"var(--font-jost)", background:"none", borderBottom: tab === t ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t ? "#1a1a1a" : "#aaa", fontWeight: tab === t ? 600 : 400}}>
            {label}
          </button>
        ))}
      </div>

      <p style={{fontSize:"13px", color:"#888", marginBottom:"24px"}}>
        {tab === "email" ? `${subscriberCount} email subscriber` : `${waCount} WA subscriber`}
      </p>

      {tab === "email" && (
        <div style={{marginBottom:"16px"}}>
          <label style={{fontSize:"11px", color:"#aaa", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"8px"}}>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            placeholder="contoh: Promo Spesial Henima 🎉"
            style={{width:"100%", border:"1px solid #e0e0e0", padding:"12px 14px", fontSize:"14px", outline:"none", fontFamily:"var(--font-jost)", boxSizing:"border-box" as const}} />
        </div>
      )}

      <div style={{marginBottom:"24px"}}>
        <label style={{fontSize:"11px", color:"#aaa", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"8px"}}>
          {tab === "email" ? "Isi Email" : "Pesan WA"}
        </label>
        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder={tab === "email" ? "Tulis isi email di sini..." : "Tulis pesan WA di sini... Bisa pakai *bold* untuk tebal"}
          rows={8}
          style={{width:"100%", border:"1px solid #e0e0e0", padding:"12px 14px", fontSize:"14px", outline:"none", fontFamily:"var(--font-jost)", resize:"vertical", boxSizing:"border-box" as const, lineHeight:1.7}} />
      </div>

      <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
        <button onClick={send} disabled={sending || (tab === "email" ? subscriberCount === 0 : waCount === 0)}
          style={{background:"#1a1a1a", color:"#fff", border:"none", padding:"12px 32px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--font-jost)"}}>
          {sending ? "Mengirim..." : `Kirim ${tab === "email" ? "Email" : "WA"}`}
        </button>
        {msg && <span style={{fontSize:"13px", color: msg.startsWith("Berhasil") ? "#2E7D32" : "#cc0000"}}>{msg}</span>}
      </div>
    </div>
  );
}
''')
print("BroadcastForm Done!")

# Update broadcast page - pass waCount
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

  const waCount = subscribers?.filter(s => s.phone).length || 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Broadcast</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>{count || 0} subscriber · {waCount} punya nomor WA</p>

      <div style={{ background: "#f9f9f9", border: "1px solid #e5e5e5", padding: "20px", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Daftar Subscriber ({count || 0})</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
          {subscribers?.map(s => (
            <span key={s.id} style={{ fontSize: "12px", background: "#fff", border: "1px solid #e0e0e0", padding: "4px 10px", color: "#555" }}>
              {s.name || s.email} {s.phone && <span style={{color:"#4CAF50"}}>✓WA</span>}
            </span>
          ))}
        </div>
      </div>

      <BroadcastForm subscriberCount={count || 0} waCount={waCount} />
    </div>
  );
}
''')
print("Page Done!")

# API WA Blast
os.makedirs("src/app/api/admin/wa-blast", exist_ok=True)
with open("src/app/api/admin/wa-blast/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { body } = await request.json();
  if (!body) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("phone, name")
    .not("phone", "is", null);

  if (!subscribers || subscribers.length === 0) return NextResponse.json({ error: "No WA subscribers" }, { status: 400 });

  let sent = 0;
  for (const sub of subscribers) {
    try {
      const phone = sub.phone.replace(/\\D/g, "").replace(/^0/, "62");
      const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": process.env.FONNTE_TOKEN || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: phone,
          message: body,
        }),
      });
      if (res.ok) sent++;
    } catch (e) {
      console.error("WA blast error:", sub.phone, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
''')
print("WA Blast API Done!")
print("All Done!")
