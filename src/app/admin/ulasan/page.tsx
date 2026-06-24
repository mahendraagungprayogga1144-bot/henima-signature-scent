import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import AdminUlasanCard from "./AdminUlasanCard";

export const dynamic = "force-dynamic";

export default async function AdminUlasanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: ulasan } = await supabase
    .from("product_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = ulasan?.filter(u => !u.approved) || [];
  const approved = ulasan?.filter(u => u.approved) || [];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <a href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</a>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Kelola Ulasan</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "40px", marginTop: "24px" }}>
        {[
          { label: "Total Ulasan", value: ulasan?.length || 0, color: "#1a1a1a" },
          { label: "Menunggu Approval", value: pending.length, color: "#DAA520" },
          { label: "Sudah Approved", value: approved.length, color: "#4CAF50" },
        ].map(s => (
          <div key={s.label} style={{ border: "1px solid #e5e5e5", padding: "16px", background: "#fff" }}>
            <p style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#DAA520", marginBottom: "16px", fontWeight: 600 }}>Menunggu Approval ({pending.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pending.map(u => <AdminUlasanCard key={u.id} ulasan={u} />)}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#4CAF50", marginBottom: "16px", fontWeight: 600 }}>Sudah Approved ({approved.length})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {approved.map(u => <AdminUlasanCard key={u.id} ulasan={u} />)}
        </div>
      </div>
    </div>
  );
}
