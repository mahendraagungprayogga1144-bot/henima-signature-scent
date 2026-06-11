"use client";
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
