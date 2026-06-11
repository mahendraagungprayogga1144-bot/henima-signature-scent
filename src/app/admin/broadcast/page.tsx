import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BroadcastForm from "./BroadcastForm";

export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: subscribers, count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const waCount = subscribers?.filter(s => s.phone).length || 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Broadcast</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>{count || 0} subscriber · {waCount} punya nomor WA</p>

      <div style={{ background: "#f9f9f9", border: "1px solid #e5e5e5", padding: "20px", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Daftar Subscriber ({count || 0})</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
          {subscribers?.map(s => (
            <span key={s.id} style={{ fontSize: "12px", background: "#fff", border: "1px solid #e0e0e0", padding: "4px 10px", color: "#555" }}>
              {s.name || s.email} {s.phone && <span style={{color:"#4CAF50"}}>✓WA</span>}
            </span>
          ))}
        </div>
      </div>

      <BroadcastForm subscriberCount={count || 0} waCount={waCount} />
    </div>
  );
}
