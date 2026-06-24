"use client";
import { useState } from "react";

export default function SubscribersClient({ subscribers }: { subscribers: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  function exportCSV() {
    const header = "Nama,Email,Tanggal Daftar";
    const rows = subscribers.map(s =>
      `${s.name || ""},${s.email},${new Date(s.created_at).toLocaleDateString("id-ID")}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers-henima.csv";
    a.click();
  }

  return (
    <div style={{ padding: "32px", background: "#F8F8F8", minHeight: "100vh", fontFamily: "var(--font-jost)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", margin: "0 0 6px" }}>MARKETING</p>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Subscribers</h1>
            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>{subscribers.length} subscriber terdaftar</p>
          </div>
          <button onClick={exportCSV} style={{
            background: "#1a1a1a", color: "#fff", border: "none",
            padding: "10px 20px", fontSize: "11px", letterSpacing: "1.5px",
            textTransform: "uppercase", cursor: "pointer", borderRadius: "4px",
          }}>
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Total Subscriber", value: subscribers.length, color: "#B5935A" },
            { label: "Bulan Ini", value: subscribers.filter(s => s.created_at?.startsWith(new Date().toISOString().slice(0, 7))).length, color: "#4CAF50" },
            { label: "Minggu Ini", value: subscribers.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 86400000)).length, color: "#3B82F6" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#fff", border: "1px solid #e5e5e5", padding: "20px", borderRadius: "6px" }}>
              <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>{stat.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          style={{
            width: "100%", border: "1px solid #e0e0e0", padding: "10px 14px",
            fontSize: "13px", marginBottom: "16px", outline: "none",
            background: "#fff", boxSizing: "border-box", borderRadius: "4px",
          }}
        />

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            {["Nama", "Email", "Tanggal Daftar"].map(h => (
              <p key={h} style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>{h}</p>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "13px" }}>Tidak ada subscriber</p>
          ) : filtered.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", alignItems: "center" }}>
              <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{s.name || "-"}</p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>{s.email}</p>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>{new Date(s.created_at).toLocaleDateString("id-ID")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
