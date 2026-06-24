"use client";
import { useState } from "react";

export default function StokClient({ products: initial }: { products: any[] }) {
  const [products, setProducts] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [newStok, setNewStok] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function saveStok(id: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/stok/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(newStok) }),
      });
      if (res.ok) {
        setProducts(p => p.map(x => x.id === id ? { ...x, stock: parseInt(newStok) } : x));
        setEditing(null);
        setMsg("Stok berhasil diupdate!");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch {}
    finally { setSaving(false); }
  }

  const getStokStatus = (stock: number) => {
    if (stock === 0) return { label: "Habis", color: "#cc0000", bg: "#fff5f5" };
    if (stock <= 10) return { label: "Hampir Habis", color: "#e65100", bg: "#fff3e0" };
    if (stock <= 30) return { label: "Terbatas", color: "#DAA520", bg: "#fffde7" };
    return { label: "Tersedia", color: "#2E7D32", bg: "#e8f5e9" };
  };

  const lowStok = products.filter(p => p.stock <= 10);

  return (
    <div style={{ padding: "32px", background: "#F8F8F8", minHeight: "100vh", fontFamily: "var(--font-jost)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", margin: "0 0 6px" }}>OPERASIONAL</p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Stok Management</h1>
          <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>Kelola stok produk Henima</p>
        </div>

        {msg && <p style={{ fontSize: "13px", color: "#4CAF50", marginBottom: "16px", fontWeight: 500 }}>{msg}</p>}

        {/* Alert stok hampir habis */}
        {lowStok.length > 0 && (
          <div style={{ background: "#fff3e0", border: "1px solid #ffcc02", borderRadius: "8px", padding: "16px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#e65100", margin: 0 }}>⚠️ {lowStok.length} produk stok hampir habis!</p>
            </div>
            {lowStok.map(p => (
              <p key={p.id} style={{ fontSize: "12px", color: "#e65100", margin: "2px 0 0 26px" }}>
                {p.name} — sisa {p.stock} unit
              </p>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Total Produk", value: products.length, color: "#1a1a1a" },
            { label: "Stok Hampir Habis", value: products.filter(p => p.stock <= 10 && p.stock > 0).length, color: "#e65100" },
            { label: "Stok Habis", value: products.filter(p => p.stock === 0).length, color: "#cc0000" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e5e5", padding: "20px", borderRadius: "6px" }}>
              <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>{s.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabel Stok */}
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 20px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
            {["Produk", "Stok Sekarang", "Status", "Aksi"].map(h => (
              <p key={h} style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>{h}</p>
            ))}
          </div>
          {products.map(p => {
            const status = getStokStatus(p.stock);
            return (
              <div key={p.id}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: "1px solid #f5f5f5", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {p.photo && <img src={p.photo} alt={p.name} style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px" }} />}
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{p.name}</p>
                  </div>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: status.color, margin: 0 }}>{p.stock}</p>
                  <span style={{ fontSize: "11px", padding: "3px 10px", background: status.bg, color: status.color, borderRadius: "20px", fontWeight: 600, display: "inline-block" }}>
                    {status.label}
                  </span>
                  <button onClick={() => { setEditing(p.id); setNewStok(String(p.stock)); }} style={{
                    background: "#1a1a1a", color: "#fff", border: "none",
                    padding: "6px 16px", fontSize: "11px", letterSpacing: "1px",
                    cursor: "pointer", borderRadius: "4px",
                  }}>Edit Stok</button>
                </div>
                {editing === p.id && (
                  <div style={{ padding: "16px 20px", background: "#f9f9f9", borderBottom: "1px solid #f0f0f0" }}>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>Update stok untuk <strong>{p.name}</strong></p>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={newStok}
                        onChange={e => setNewStok(e.target.value)}
                        style={{ border: "1px solid #e0e0e0", padding: "8px 12px", fontSize: "14px", outline: "none", width: "100px", borderRadius: "4px" }}
                      />
                      <button onClick={() => saveStok(p.id)} disabled={saving} style={{
                        background: "#4CAF50", color: "#fff", border: "none",
                        padding: "8px 20px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                      }}>{saving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditing(null)} style={{
                        background: "transparent", color: "#888", border: "1px solid #e0e0e0",
                        padding: "8px 16px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                      }}>Batal</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
