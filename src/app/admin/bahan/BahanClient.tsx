"use client";

import { useState } from "react";

export type Material = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  unit_cost: number;
  notes: string;
};

export default function BahanClient({ initial }: { initial: Material[] }) {
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [msg, setMsg] = useState("");

  async function add() {
    if (!name.trim()) return;
    const res = await fetch("/api/admin/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, unit, qty: 0, unit_cost: 0 }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Gagal");
      return;
    }
    setRows((prev) => [...prev, data.material]);
    setName("");
    setMsg("Bahan ditambahkan");
  }

  async function adjust(id: string, delta: number) {
    const res = await fetch(`/api/admin/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adjustQty: delta,
        catatan: delta > 0 ? "Stok masuk" : "Pakai produksi / keluar",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal update");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? data.material : r)));
  }

  async function remove(id: string) {
    if (!confirm("Hapus bahan ini?")) return;
    const res = await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Stok Bahan Baku</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 28 }}>
        Catat bibit, botol, box, alkohol — untuk produksi Batch 1 & Batch 2.
        {msg ? ` · ${msg}` : ""}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama bahan"
          style={{ border: "1px solid #ddd", padding: "10px 12px", minWidth: 200 }}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ border: "1px solid #ddd", padding: "10px 12px" }}>
          {["pcs", "ml", "liter", "gram", "kg", "botol"].map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          style={{
            background: "#1C1917",
            color: "#FAF8F4",
            border: "none",
            padding: "10px 16px",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          + Tambah
        </button>
      </div>

      <div style={{ border: "1px solid #e5e5e5", background: "#fff" }}>
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 12,
              padding: "14px 16px",
              borderBottom: "1px solid #f0f0f0",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{r.name}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                Stok:{" "}
                <strong style={{ color: Number(r.qty) <= 0 ? "#B3261E" : "#1a1a1a" }}>
                  {r.qty}
                </strong>{" "}
                {r.unit}
                {r.unit_cost ? ` · @ Rp${Number(r.unit_cost).toLocaleString("id-ID")}` : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => adjust(r.id, 100)} style={btnMini}>+100</button>
              <button type="button" onClick={() => adjust(r.id, 10)} style={btnMini}>+10</button>
              <button type="button" onClick={() => adjust(r.id, -10)} style={btnMini}>−10</button>
              <button type="button" onClick={() => adjust(r.id, -100)} style={btnMini}>−100</button>
            </div>
            <button type="button" onClick={() => remove(r.id)} style={{ ...btnMini, color: "#B3261E" }}>
              Hapus
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p style={{ padding: 24, color: "#aaa", textAlign: "center" }}>
            Belum ada bahan. Jalankan SQL <code>006_material_stocks.sql</code> lalu refresh, atau tambah manual.
          </p>
        )}
      </div>
    </div>
  );
}

const btnMini: React.CSSProperties = {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "6px 10px",
  fontSize: 11,
  cursor: "pointer",
};
