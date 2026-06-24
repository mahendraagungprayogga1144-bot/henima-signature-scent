"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Menunggu Bayar", color: "#F59E0B" },
  paid: { label: "Sudah Bayar", color: "#3B82F6" },
  processing: { label: "Diproses", color: "#8B5CF6" },
  shipped: { label: "Dikirim", color: "#10B981" },
  delivered: { label: "Selesai", color: "#22C55E" },
  cancelled: { label: "Dibatalkan", color: "#EF4444" },
};

export default function AdminDashboardClient({
  totalRevenue, revenueToday, totalOrders, pendingOrders,
  processingOrders, shippedOrders, revenueByDay, recentOrders, totalUlasan
}: any) {
  const kpis = [
    { label: "Total Revenue", value: fmt(totalRevenue), sub: "Semua waktu", color: "#B5935A", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B5935A" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { label: "Revenue Hari Ini", value: fmt(revenueToday), sub: "Hari ini", color: "#22C55E", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
    { label: "Total Orders", value: totalOrders, sub: "Semua order", color: "#3B82F6", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
    { label: "Menunggu Bayar", value: pendingOrders, sub: "Perlu konfirmasi", color: "#F59E0B", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: "Diproses", value: processingOrders, sub: "Sedang dikemas", color: "#8B5CF6", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
    { label: "Dikirim", value: shippedOrders, sub: "Dalam pengiriman", color: "#10B981", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { label: "Total Ulasan", value: totalUlasan, sub: "Sudah approved", color: "#F472B6", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  ];

  return (
    <div style={{ padding: "32px", background: "#0F1117", minHeight: "100vh", color: "#F0EBE3" }}>
      <style>{`
        .kpi-card { transition: transform 0.2s, border-color 0.2s; }
        .kpi-card:hover { transform: translateY(-2px); border-color: rgba(181,147,90,0.3) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", margin: "0 0 6px" }}>ADMIN PANEL</p>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#F0EBE3", margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>Overview performa Henima Signature Scent</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card" style={{
            background: "#161820",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", color: "#555", margin: 0, letterSpacing: "0.5px" }}>{kpi.label}</p>
              {kpi.icon}
            </div>
            <p style={{ fontSize: "24px", fontWeight: 700, color: kpi.color, margin: "0 0 4px" }}>{kpi.value}</p>
            <p style={{ fontSize: "11px", color: "#444", margin: 0 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "#161820",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#F0EBE3", margin: "0 0 4px" }}>Revenue 7 Hari Terakhir</p>
            <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>Pendapatan dari order delivered</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueByDay}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B5935A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#B5935A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" stroke="#444" tick={{ fill: "#555", fontSize: 11 }} />
            <YAxis stroke="#444" tick={{ fill: "#555", fontSize: 11 }} tickFormatter={v => v === 0 ? "0" : (v/1000) + "k"} />
            <Tooltip
              contentStyle={{ background: "#1E2028", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }}
              labelStyle={{ color: "#F0EBE3", fontSize: 12 }}
              formatter={(v: any) => [fmt(v), "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#B5935A" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div style={{
        background: "#161820",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#F0EBE3", margin: 0 }}>Order Terbaru</p>
          <a href="/admin/orders" style={{ fontSize: "11px", color: "#B5935A", textDecoration: "none", letterSpacing: "1px" }}>Lihat Semua →</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {["Order ID", "Customer", "Total", "Status"].map(h => (
              <p key={h} style={{ fontSize: "10px", color: "#444", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>{h}</p>
            ))}
          </div>
          {recentOrders.map((o: any) => {
            const customer = typeof o.customer === "string" ? JSON.parse(o.customer) : o.customer;
            const st = STATUS_LABELS[o.status] || { label: o.status, color: "#888" };
            return (
              <a key={o.id} href={`/admin/orders`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px",
                  padding: "12px", borderRadius: "4px",
                  transition: "background 0.15s",
                }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                   onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <p style={{ fontSize: "12px", color: "#777", margin: 0, fontFamily: "monospace" }}>{o.id?.slice(0, 20)}...</p>
                  <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{customer?.name || "-"}</p>
                  <p style={{ fontSize: "12px", color: "#B5935A", margin: 0, fontWeight: 600 }}>{fmt(o.total || 0)}</p>
                  <span style={{
                    fontSize: "10px", padding: "3px 8px", borderRadius: "20px",
                    background: st.color + "20", color: st.color,
                    display: "inline-block", fontWeight: 600, letterSpacing: "0.5px",
                  }}>{st.label}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
