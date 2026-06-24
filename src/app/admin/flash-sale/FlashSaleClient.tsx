"use client";
import { useState } from "react";

export default function FlashSaleClient({ flashSales: initial, products }: { flashSales: any[], products: any[] }) {
  const [flashSales, setFlashSales] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "", product_id: "", discount_type: "percent",
    discount_value: "", stock_limit: "10",
    start_at: "", end_at: "",
  });

  const selectedProduct = products.find(p => p.id === form.product_id);
  const originalPrice = selectedProduct ? Math.min(...selectedProduct.variants.filter((v: any) => v.active).map((v: any) => v.price || v.originalPrice)) : 0;
  const flashPrice = form.discount_value ? (
    form.discount_type === "percent"
      ? Math.floor(originalPrice * (1 - parseInt(form.discount_value) / 100))
      : originalPrice - parseInt(form.discount_value)
  ) : 0;

  async function save() {
    if (!form.name || !form.product_id || !form.discount_value || !form.start_at || !form.end_at) {
      setMsg("Semua field wajib diisi!"); return;
    }
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/admin/flash-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          product_id: form.product_id,
          product_name: selectedProduct?.name || "",
          discount_type: form.discount_type,
          discount_value: parseInt(form.discount_value),
          original_price: originalPrice,
          flash_price: flashPrice,
          stock_limit: parseInt(form.stock_limit) || 10,
          start_at: new Date(form.start_at).toISOString(),
          end_at: new Date(form.end_at).toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFlashSales(f => [data.flashSale, ...f]);
        setShowForm(false);
        setForm({ name: "", product_id: "", discount_type: "percent", discount_value: "", stock_limit: "10", start_at: "", end_at: "" });
        setMsg("Flash sale berhasil dibuat!");
      } else { setMsg("Gagal: " + data.error); }
    } catch { setMsg("Error"); }
    finally { setSaving(false); }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/admin/flash-sale/" + id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    setFlashSales(f => f.map(x => x.id === id ? { ...x, active: !active } : x));
  }

  async function deleteSale(id: string) {
    if (!confirm("Hapus flash sale ini?")) return;
    await fetch("/api/admin/flash-sale/" + id, { method: "DELETE" });
    setFlashSales(f => f.filter(x => x.id !== id));
  }

  const now = new Date();

  return (
    <div style={{ padding: "32px", background: "#F8F8F8", minHeight: "100vh", fontFamily: "var(--font-jost)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", margin: "0 0 6px" }}>MARKETING</p>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Flash Sale</h1>
            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>{flashSales.filter(f => f.active && new Date(f.end_at) > now).length} flash sale aktif</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: "#E53935", color: "#fff", border: "none", padding: "10px 20px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px" }}>
            ⚡ Buat Flash Sale
          </button>
        </div>

        {msg && <p style={{ fontSize: "13px", color: msg.includes("Gagal") || msg.includes("Error") || msg.includes("wajib") ? "#cc0000" : "#4CAF50", marginBottom: "16px" }}>{msg}</p>}

        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "20px", color: "#1a1a1a" }}>Buat Flash Sale Baru</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Nama Flash Sale</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="misal: Flash Sale Kemerdekaan"
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Produk</label>
                <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", background: "#fff" }}>
                  <option value="">Pilih Produk</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              {selectedProduct && (
                <div style={{ gridColumn: "1 / -1", background: "#f9f9f9", padding: "12px", borderRadius: "6px", fontSize: "13px", color: "#555" }}>
                  Harga normal: <strong>Rp {originalPrice.toLocaleString("id-ID")}</strong>
                  {flashPrice > 0 && <> → Harga flash sale: <strong style={{ color: "#E53935" }}>Rp {flashPrice.toLocaleString("id-ID")}</strong></>}
                </div>
              )}
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Tipe Diskon</label>
                <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", background: "#fff" }}>
                  <option value="percent">Persen (%)</option>
                  <option value="fixed">Nominal (Rp)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Nilai Diskon {form.discount_type === "percent" ? "(%)" : "(Rp)"}
                </label>
                <input value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                  type="number" placeholder={form.discount_type === "percent" ? "10" : "20000"}
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Batas Stok Flash Sale</label>
                <input value={form.stock_limit} onChange={e => setForm(f => ({ ...f, stock_limit: e.target.value }))}
                  type="number" placeholder="10"
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Mulai</label>
                <input value={form.start_at} onChange={e => setForm(f => ({ ...f, start_at: e.target.value }))}
                  type="datetime-local"
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Selesai</label>
                <input value={form.end_at} onChange={e => setForm(f => ({ ...f, end_at: e.target.value }))}
                  type="datetime-local"
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={save} disabled={saving} style={{ background: "#E53935", color: "#fff", border: "none", padding: "10px 24px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px" }}>
                {saving ? "Menyimpan..." : "⚡ Buat Flash Sale"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#888", border: "1px solid #e0e0e0", padding: "10px 24px", fontSize: "11px", cursor: "pointer" }}>Batal</button>
            </div>
          </div>
        )}

        {/* List Flash Sales */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {flashSales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#aaa", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "6px" }}>
              Belum ada flash sale. Buat flash sale pertamamu!
            </div>
          ) : flashSales.map(fs => {
            const isActive = fs.active && new Date(fs.start_at) <= now && new Date(fs.end_at) > now;
            const isUpcoming = fs.active && new Date(fs.start_at) > now;
            const isExpired = new Date(fs.end_at) <= now;
            const progress = fs.stock_limit > 0 ? Math.min(100, (fs.sold_count / fs.stock_limit) * 100) : 0;
            return (
              <div key={fs.id} style={{ background: "#fff", border: `1px solid ${isActive ? "#E53935" : "#e5e5e5"}`, borderRadius: "8px", padding: "20px", position: "relative", overflow: "hidden" }}>
                {isActive && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #E53935, #FF7043)" }}></div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "16px" }}>⚡</span>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{fs.name}</p>
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600,
                        background: isActive ? "#FFEBEE" : isUpcoming ? "#E3F2FD" : "#f5f5f5",
                        color: isActive ? "#E53935" : isUpcoming ? "#1565C0" : "#aaa" }}>
                        {isActive ? "🔴 LIVE" : isUpcoming ? "🔵 Upcoming" : "⚫ Berakhir"}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px" }}>{fs.product_name}</p>
                    <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 8px" }}>
                      <span style={{ textDecoration: "line-through" }}>Rp {fs.original_price?.toLocaleString("id-ID")}</span>
                      {" → "}
                      <span style={{ color: "#E53935", fontWeight: 700 }}>Rp {fs.flash_price?.toLocaleString("id-ID")}</span>
                      {" · "}{fs.discount_type === "percent" ? fs.discount_value + "% off" : "Hemat Rp " + fs.discount_value?.toLocaleString("id-ID")}
                    </p>
                    <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
                      {new Date(fs.start_at).toLocaleString("id-ID")} — {new Date(fs.end_at).toLocaleString("id-ID")}
                    </p>
                    {/* Progress stok */}
                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", color: "#aaa" }}>Terjual: {fs.sold_count}/{fs.stock_limit}</span>
                        <span style={{ fontSize: "11px", color: "#E53935", fontWeight: 600 }}>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: progress + "%", height: "100%", background: "linear-gradient(90deg, #E53935, #FF7043)", borderRadius: "3px", transition: "width 0.5s" }}></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => toggleActive(fs.id, fs.active)} style={{
                      background: fs.active ? "#fff3e0" : "#e8f5e9", color: fs.active ? "#e65100" : "#2E7D32",
                      border: "1px solid", borderColor: fs.active ? "#ffcc02" : "#a5d6a7",
                      padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                    }}>
                      {fs.active ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button onClick={() => deleteSale(fs.id)} style={{
                      background: "#fff5f5", color: "#cc0000", border: "1px solid #ffcdd2",
                      padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                    }}>Hapus</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
