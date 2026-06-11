# API manage subscribers
import os
os.makedirs("src/app/api/admin/subscribers", exist_ok=True)

with open("src/app/api/admin/subscribers/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, name, phone } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const { error } = await supabase.from("subscribers").upsert(
    { email, name: name || null, phone: phone || null },
    { onConflict: "email" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await request.json();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
''')
print("API Done!")

with open("src/app/admin/broadcast/page.tsx", "w") as f:
    f.write('''import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BroadcastForm from "./BroadcastForm";
import SubscriberManager from "./SubscriberManager";

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
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Broadcast</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>{count || 0} subscriber · {waCount} punya nomor WA</p>

      <SubscriberManager subscribers={subscribers || []} />

      <div style={{ marginTop: "48px" }}>
        <BroadcastForm subscriberCount={count || 0} waCount={waCount} />
      </div>
    </div>
  );
}
''')
print("Page Done!")

with open("src/app/admin/broadcast/SubscriberManager.tsx", "w") as f:
    f.write('''"use client";
import { useState } from "react";

export default function SubscriberManager({ subscribers: initial }: { subscribers: any[] }) {
  const [subscribers, setSubscribers] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  async function add() {
    if (!email.trim()) { setMsg("Email wajib diisi!"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone }),
      });
      if (res.ok) {
        setSubscribers(prev => [...prev, { email, name, phone, id: Date.now() }]);
        setEmail(""); setName(""); setPhone("");
        setMsg("Subscriber ditambahkan!");
      } else {
        const data = await res.json();
        setMsg(data.error || "Gagal");
      }
    } catch { setMsg("Error"); }
    finally { setAdding(false); }
  }

  async function remove(email: string) {
    if (!confirm("Hapus subscriber ini?")) return;
    try {
      await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribers(prev => prev.filter(s => s.email !== email));
    } catch {}
  }

  return (
    <div style={{ border: "1px solid #e5e5e5", padding: "24px", background: "#fafafa" }}>
      <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: "20px" }}>
        Kelola Subscriber ({subscribers.length})
      </p>

      {/* Add form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", marginBottom: "20px" }} className="sub-add-grid">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama"
          style={{ border: "1px solid #e0e0e0", padding: "9px 12px", fontSize: "13px", outline: "none" }} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *"
          style={{ border: "1px solid #e0e0e0", padding: "9px 12px", fontSize: "13px", outline: "none" }} />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="No WA (08xx)"
          style={{ border: "1px solid #e0e0e0", padding: "9px 12px", fontSize: "13px", outline: "none" }} />
        <button onClick={add} disabled={adding}
          style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "9px 16px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" as const }}>
          + Tambah
        </button>
      </div>
      {msg && <p style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>{msg}</p>}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "300px", overflowY: "auto" }}>
        {subscribers.map(s => (
          <div key={s.id || s.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #f0f0f0", padding: "10px 14px", fontSize: "13px" }}>
            <div>
              {s.name && <span style={{ fontWeight: 500, marginRight: "8px" }}>{s.name}</span>}
              <span style={{ color: "#555" }}>{s.email}</span>
              {s.phone && <span style={{ color: "#4CAF50", fontSize: "11px", marginLeft: "8px" }}>📱 {s.phone}</span>}
            </div>
            <button onClick={() => remove(s.email)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#cc0000", fontSize: "18px", lineHeight: 1 }}>×</button>
          </div>
        ))}
        {subscribers.length === 0 && <p style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "20px" }}>Belum ada subscriber</p>}
      </div>

      <style>{"@media (max-width: 768px) { .sub-add-grid { grid-template-columns: 1fr !important; } }"}</style>
    </div>
  );
}
''')
print("SubscriberManager Done!")
print("All Done!")
