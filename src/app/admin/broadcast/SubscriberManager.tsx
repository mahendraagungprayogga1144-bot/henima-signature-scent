"use client";
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
