"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/orders/" + orderId.trim());
      if (!res.ok) { setError("Order tidak ditemukan."); return; }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const statusSteps = ["pending_payment", "paid", "processing", "shipped", "delivered"];
  const statusLabels: Record<string, string> = {
    pending_payment: "Menunggu Pembayaran",
    paid: "Pembayaran Diterima",
    processing: "Diproses",
    shipped: "Dikirim",
    delivered: "Selesai",
  };
  const statusColors: Record<string, string> = {
    pending_payment: "#C8B89A",
    paid: "#B5935A",
    processing: "#DAA520",
    shipped: "#4CAF50",
    delivered: "#2E7D32",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>

      {/* HERO */}
      <div style={{ padding: "80px 8vw 60px", borderBottom: "1px solid rgba(28,25,23,0.08)", textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "16px" }}>Henima Signature Scent</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, fontStyle: "italic", color: "#1C1917", marginBottom: "16px" }}>
          Track Your Order
        </h1>
        <p style={{ fontSize: "14px", color: "#9A8F82", maxWidth: "400px", margin: "0 auto" }}>
          Enter your Order ID to check the status of your purchase.
        </p>
      </div>

      {/* SEARCH */}
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "flex", gap: "0", marginBottom: "40px" }}>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Order ID (contoh: ORD-1234567890-ABCD)"
            style={{ flex: 1, border: "1px solid #D5CFC8", borderRight: "none", padding: "14px 16px", fontSize: "13px", color: "#1C1917", background: "#fff", outline: "none", fontFamily: "var(--font-jost)" }}
          />
          <button
            onClick={search}
            disabled={loading}
            style={{ background: "#1C1917", color: "#FAF8F4", border: "none", padding: "14px 28px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 500, whiteSpace: "nowrap" }}
          >
            {loading ? "..." : "Track"}
          </button>
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffc5c5", padding: "16px", fontSize: "13px", color: "#cc0000", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {order && (
          <div>
            {/* Status Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#9A8F82", letterSpacing: "1px", marginBottom: "4px" }}>Order ID</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1C1917" }}>{order.id}</p>
              </div>
              <div style={{ background: statusColors[order.status] || "#C8B89A", color: "#fff", padding: "6px 16px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>
                {statusLabels[order.status] || order.status}
              </div>
            </div>

            {/* Progress Steps */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", height: "2px", background: "#E8E0D5", zIndex: 0 }} />
                {statusSteps.map((step, i) => {
                  const currentIndex = statusSteps.indexOf(order.status);
                  const isPast = i <= currentIndex;
                  return (
                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 1 }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: isPast ? "#1C1917" : "#E8E0D5", border: "2px solid " + (isPast ? "#1C1917" : "#E8E0D5"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>
                        {isPast && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#FAF8F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <p style={{ fontSize: "9px", letterSpacing: "0.5px", textTransform: "uppercase", color: isPast ? "#1C1917" : "#C8B89A", textAlign: "center", maxWidth: "56px", lineHeight: 1.3, fontWeight: isPast ? 600 : 400 }}>
                        {statusLabels[step]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail */}
            <div style={{ background: "#fff", border: "1px solid #E8E0D5", padding: "28px", marginBottom: "24px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "20px" }}>Detail Pesanan</p>
              {order.items?.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                  <span style={{ color: "#1C1917" }}>{item.productName} {item.sizeMl}ml × {item.quantity}</span>
                  <span style={{ fontWeight: 500 }}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
              <div style={{ height: "1px", background: "#E8E0D5", margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: "#9A8F82" }}>Subtotal</span>
                <span>Rp {order.subtotal?.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "16px" }}>
                <span style={{ color: "#9A8F82" }}>Ongkir ({order.courier_name})</span>
                <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700 }}>
                <span>Total</span>
                <span>Rp {order.total?.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Resi */}
            {order.resi && (
              <div style={{ background: "#F0EBE3", border: "1px solid #D5CFC8", padding: "20px", marginBottom: "24px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "8px" }}>Nomor Resi</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#1C1917", letterSpacing: "2px" }}>{order.resi}</p>
                <p style={{ fontSize: "12px", color: "#9A8F82", marginTop: "4px" }}>{order.courier_name}</p>
              </div>
            )}

            {/* Customer */}
            <div style={{ background: "#fff", border: "1px solid #E8E0D5", padding: "24px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "16px" }}>Dikirim ke</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1C1917", marginBottom: "4px" }}>{order.customer?.name}</p>
              <p style={{ fontSize: "13px", color: "#6B5E52", lineHeight: 1.7 }}>{order.customer?.address}, {order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
              <p style={{ fontSize: "13px", color: "#9A8F82", marginTop: "8px" }}>{order.customer?.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
