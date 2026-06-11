"use client";
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
