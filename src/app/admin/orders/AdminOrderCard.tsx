"use client";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Bayar",
  paid: "Sudah Bayar",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "#C8B89A",
  paid: "#B5935A",
  processing: "#DAA520",
  shipped: "#4CAF50",
  delivered: "#2E7D32",
  cancelled: "#cc0000",
};

export default function AdminOrderCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [resi, setResi] = useState(order.resi || "");
  const [saving, setSaving] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/retail-orders/" + order.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resi, courier_code: order.courier_code }),
      });
      if (res.ok) setMsg("Tersimpan!");
      else { const err = await res.text(); setMsg("Gagal: " + err); }
    } catch { setMsg("Error"); }
    finally { setSaving(false); }
  }

  async function createShipment() {
    if (!confirm("Buat pengiriman otomatis via Biteship? Resi akan otomatis masuk dan email dikirim ke customer.")) return;
    setShipping(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/create-shipment/" + order.id, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResi(data.resi);
        setStatus("shipped");
        setMsg("Pengiriman dibuat! Resi: " + data.resi);
      } else {
        setMsg("Gagal: " + (data.error || "Unknown error"));
      }
    } catch { setMsg("Error membuat pengiriman"); }
    finally { setShipping(false); }
  }

  const canShip = (status === "paid" || status === "processing") && !resi;

  return (
    <div style={{ border: "1px solid #e5e5e5", background: "#fff", overflow: "hidden" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>{order.id}</p>
            <span style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "2px 8px", background: STATUS_COLORS[order.status] || "#888", color: "#fff", fontWeight: 600 }}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
            {order.resi && (
              <span style={{ fontSize: "10px", color: "#4CAF50", fontWeight: 600 }}>Resi: {order.resi}</span>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "#888" }}>{order.customer?.name} · {order.customer?.phone} · {order.customer?.city}</p>
          <p style={{ fontSize: "11px", color: "#aaa" }}>{order.customer?.email}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>Rp {order.total?.toLocaleString("id-ID")}</p>
          <p style={{ fontSize: "11px", color: "#aaa" }}>{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
        </div>
        <span style={{ color: "#aaa", transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "0.2s" }}>›</span>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px", background: "#fafafa" }}>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Items</p>
            {order.items?.map((item: any, i: number) => (
              <p key={i} style={{ fontSize: "13px", color: "#555", marginBottom: "4px" }}>
                {item.productName} {item.sizeMl}ml x {item.quantity} = Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </p>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Pengiriman</p>
            <p style={{ fontSize: "13px", color: "#555" }}>{order.courier_name} · Rp {order.shipping_cost?.toLocaleString("id-ID")}</p>
            <p style={{ fontSize: "13px", color: "#555" }}>{order.customer?.address}, {order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
            {resi && (
              <div style={{ marginTop: "10px", padding: "10px 14px", background: "#1a1a1a", color: "#fff", display: "inline-block" }}>
                <span style={{ fontSize: "10px", color: "#C8B89A", letterSpacing: "1px", textTransform: "uppercase" }}>Nomor Resi: </span>
                <span style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "2px" }}>{resi}</span>
              </div>
            )}
          </div>

          {canShip && (
            <div style={{ marginBottom: "20px", padding: "16px", background: "#f0f7f0", border: "1px solid #c8e6c9" }}>
              <p style={{ fontSize: "11px", color: "#2E7D32", marginBottom: "10px", fontWeight: 600 }}>PENGIRIMAN OTOMATIS</p>
              <p style={{ fontSize: "12px", color: "#555", marginBottom: "12px" }}>
                Klik tombol di bawah untuk otomatis membuat order pickup ke Biteship. Resi akan masuk ke sistem dan email dikirim ke customer.
              </p>
              <button
                onClick={createShipment}
                disabled={shipping}
                style={{
                  background: shipping ? "#aaa" : "#2E7D32",
                  color: "#fff",
                  border: "none",
                  padding: "12px 28px",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: shipping ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                {shipping ? "Membuat Pengiriman..." : "Buat Pengiriman Otomatis"}
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", border: "1px solid #e0e0e0", padding: "8px 10px", fontSize: "13px", background: "#fff", outline: "none" }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Nomor Resi</label>
              <input
                value={resi}
                readOnly={!!resi}
                onChange={e => setResi(e.target.value)}
                placeholder="Otomatis dari Biteship..."
                style={{
                  width: "100%",
                  border: "1px solid #e0e0e0",
                  padding: "8px 10px",
                  fontSize: "13px",
                  background: resi ? "#f5f5f5" : "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={save} disabled={saving} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 24px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            {msg && <span style={{ fontSize: "12px", color: msg.includes("Gagal") || msg.includes("Error") ? "#cc0000" : "#2E7D32" }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
