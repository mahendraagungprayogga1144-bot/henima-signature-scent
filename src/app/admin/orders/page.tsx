import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminOrderCard from "./AdminOrderCard";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: orders } = await supabase
    .from("retail_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = orders?.filter(o => o.status === "pending_payment") || [];
  const paid = orders?.filter(o => o.status === "paid") || [];
  const processing = orders?.filter(o => o.status === "processing") || [];
  const shipped = orders?.filter(o => o.status === "shipped") || [];
  const delivered = orders?.filter(o => o.status === "delivered") || [];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Retail Orders</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "40px", marginTop: "24px" }}>
        {[
          { label: "Menunggu Bayar", value: pending.length, color: "#C8B89A" },
          { label: "Sudah Bayar", value: paid.length, color: "#B5935A" },
          { label: "Diproses", value: processing.length, color: "#DAA520" },
          { label: "Dikirim", value: shipped.length, color: "#4CAF50" },
          { label: "Selesai", value: delivered.length, color: "#2E7D32" },
        ].map(s => (
          <div key={s.label} style={{ border: "1px solid #e5e5e5", padding: "16px", background: "#fff" }}>
            <p style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {orders && orders.length > 0 ? orders.map(order => (
          <AdminOrderCard key={order.id} order={order} />
        )) : (
          <div style={{ textAlign: "center", padding: "60px", color: "#aaa", border: "1px solid #e5e5e5" }}>
            Belum ada order masuk
          </div>
        )}
      </div>
    </div>
  );
}
