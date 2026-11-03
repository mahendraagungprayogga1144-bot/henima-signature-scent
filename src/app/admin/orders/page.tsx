import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminOrderCard from "./AdminOrderCard";
import { formatRupiah, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { tab } = await searchParams;
  const activeTab = tab === "reseller" ? "reseller" : "retail";

  if (activeTab === "reseller") {
    const db = await getDatabase();
    const orders = db.orders
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jakarta)" }}>
        <Tabs active="reseller" />
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "24px" }}>
          Pesanan Reseller
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#aaa", border: "1px solid #e5e5e5" }}>
              Belum ada pesanan reseller
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={{ border: "1px solid #e5e5e5", background: "#fff", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{o.id}</p>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {o.resellerName || o.storeName} · {o.resellerPhone}
                    </p>
                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{formatDate(o.createdAt)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#B5935A" }}>
                      {ORDER_STATUS_LABELS[o.status] || o.status}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{formatRupiah(o.total)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("retail_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = orders?.filter((o) => o.status === "pending_payment") || [];
  const paid = orders?.filter((o) => o.status === "paid") || [];
  const processing = orders?.filter((o) => o.status === "processing") || [];
  const shipped = orders?.filter((o) => o.status === "shipped") || [];
  const delivered = orders?.filter((o) => o.status === "delivered") || [];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jakarta)" }}>
      <Tabs active="retail" />
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>
        Pesanan Retail
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "40px", marginTop: "24px" }}>
        {[
          { label: "Menunggu Bayar", value: pending.length, color: "#C8B89A" },
          { label: "Sudah Bayar", value: paid.length, color: "#B5935A" },
          { label: "Diproses", value: processing.length, color: "#DAA520" },
          { label: "Dikirim", value: shipped.length, color: "#4CAF50" },
          { label: "Selesai", value: delivered.length, color: "#2E7D32" },
        ].map((s) => (
          <div key={s.label} style={{ border: "1px solid #e5e5e5", padding: "16px", background: "#fff" }}>
            <p style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {orders && orders.length > 0 ? (
          orders.map((order) => <AdminOrderCard key={order.id} order={order} />)
        ) : (
          <div style={{ textAlign: "center", padding: "60px", color: "#aaa", border: "1px solid #e5e5e5" }}>
            Belum ada order masuk
          </div>
        )}
      </div>
    </div>
  );
}

function Tabs({ active }: { active: "retail" | "reseller" }) {
  const base: React.CSSProperties = {
    padding: "8px 16px",
    fontSize: 11,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    textDecoration: "none",
    border: "1px solid #e5e5e5",
  };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href="/admin/orders" style={{ ...base, background: active === "retail" ? "#1C1917" : "#fff", color: active === "retail" ? "#FAF8F4" : "#666" }}>
        Retail
      </Link>
      <Link href="/admin/orders?tab=reseller" style={{ ...base, background: active === "reseller" ? "#1C1917" : "#fff", color: active === "reseller" ? "#FAF8F4" : "#666" }}>
        Reseller
      </Link>
    </div>
  );
}
