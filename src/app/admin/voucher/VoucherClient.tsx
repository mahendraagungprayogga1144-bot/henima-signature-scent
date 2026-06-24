"use client";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  discount_percent: "Diskon %",
  discount_fixed: "Diskon Rp",
  free_shipping: "Gratis Ongkir",
};

export default function VoucherClient({ vouchers: initialVouchers }: { vouchers: any[] }) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    code: "",
    type: "discount_percent",
    value: "",
    min_order: "",
    max_uses: "100",
    expires_at: "",
  });

  function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = "HENIMA" + Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setForm(f => ({ ...f, code }));
  }

  async function saveVoucher() {
    if (!form.code) return;
    if (form.type !== "free_shipping" && !form.value) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: parseInt(form.value),
          min_order: parseInt(form.min_order) || 0,
          max_uses: parseInt(form.max_uses) || 100,
          expires_at: form.expires_at || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVouchers(v => [data.voucher, ...v]);
        setShowForm(false);
        setForm({ code: "", type: "discount_percent", value: "", min_order: "", max_uses: "100", expires_at: "" });
        setMsg("Voucher berhasil dibuat!");
      } else {
        setMsg("Gagal: " + data.error);
      }
    } catch { setMsg("Error"); }
    finally { setSaving(false); }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/admin/voucher/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setVouchers(v => v.map(x => x.id === id ? { ...x, active: !active } : x));
  }

  async function deleteVoucher(id: string) {
    if (!confirm("Hapus voucher ini?")) return;
    await fetch("/api/admin/voucher/" + id, { method: "DELETE" });
    setVouchers(v => v.filter(x => x.id !== id));
  }

  return (
    <div style={{ padding: "32px", background: "#F8F8F8", minHeight: "100vh", fontFamily: "var(--font-jost)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", margin: "0 0 6px" }}>MARKETING</p>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Voucher & Promo</h1>
            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>{vouchers.filter(v => v.active).length} voucher aktif</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: "#1a1a1a", color: "#fff", border: "none",
            padding: "10px 20px", fontSize: "11px", letterSpacing: "1.5px",
            textTransform: "uppercase", cursor: "pointer", borderRadius: "4px",
          }}>
            + Buat Voucher
          </button>
        </div>

        {msg && <p style={{ fontSize: "13px", color: "#4CAF50", marginBottom: "16px" }}>{msg}</p>}

        {/* Form Buat Voucher */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "20px" }}>Buat Voucher Baru</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Kode Voucher</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="HENIMA2026" style={{ flex: 1, border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", fontFamily: "monospace", letterSpacing: "2px" }} />
                  <button onClick={generateCode} style={{ background: "#f0f0f0", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" }}>Auto</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Tipe Voucher</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", background: "#fff" }}>
                  <option value="discount_percent">Diskon % (misal 10%)</option>
                  <option value="discount_fixed">Diskon Rp (misal Rp 20.000)</option>
                  <option value="free_shipping">Gratis Ongkir</option>
                </select>
              </div>
              {form.type !== "free_shipping" && (
                <div>
                  <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    Nilai {form.type === "discount_percent" ? "(%)" : "(Rp)"}
                  </label>
                  <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === "discount_percent" ? "10" : "20000"} type="number"
                    style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Min. Order (Rp)</label>
                <input value={form.min_order} onChange={e => setForm(f => ({ ...f, min_order: e.target.value }))}
                  placeholder="0 = tidak ada minimum" type="number"
                  style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Maks. Penggunaan</label>
                <input value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                  type="number" style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Berlaku Sampai</label>
                <input value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                  type="date" style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={saveVoucher} disabled={saving} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 24px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
                {saving ? "Menyimpan..." : "Simpan Voucher"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#888", border: "1px solid #e0e0e0", padding: "10px 24px", fontSize: "11px", cursor: "pointer" }}>
                Batal
              </button>
            </div>
          </div>
        )}

        {/* List Voucher */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {vouchers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#aaa", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "6px" }}>
              Belum ada voucher. Buat voucher pertamamu!
            </div>
          ) : vouchers.map(v => (
            <div key={v.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "2px" }}>{v.code}</span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", background: v.active ? "#E8F5E9" : "#f5f5f5", color: v.active ? "#2E7D32" : "#aaa", borderRadius: "20px", fontWeight: 600 }}>
                    {v.active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                  {TYPE_LABELS[v.type]} · {v.type === "discount_percent" ? v.value + "%" : v.type === "discount_fixed" ? "Rp " + v.value?.toLocaleString("id-ID") : "Gratis Ongkir"}
                  {v.min_order > 0 && ` · Min. Rp ${v.min_order?.toLocaleString("id-ID")}`}
                  {" · "}{v.used_count}/{v.max_uses} digunakan
                  {v.expires_at && ` · s/d ${new Date(v.expires_at).toLocaleDateString("id-ID")}`}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => toggleActive(v.id, v.active)} style={{
                  background: v.active ? "#fff3e0" : "#e8f5e9", color: v.active ? "#e65100" : "#2E7D32",
                  border: "1px solid", borderColor: v.active ? "#ffcc02" : "#a5d6a7",
                  padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                }}>
                  {v.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button onClick={() => deleteVoucher(v.id)} style={{
                  background: "#fff5f5", color: "#cc0000", border: "1px solid #ffcdd2",
                  padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "4px",
                }}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
