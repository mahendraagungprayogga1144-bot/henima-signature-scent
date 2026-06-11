import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BroadcastForm from "./BroadcastForm";
import SubscriberManager from "./SubscriberManager";

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
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-jost)" }}>
      <Link href="/admin" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "8px" }}>Broadcast</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>{count || 0} subscriber · {waCount} punya nomor WA</p>

      <SubscriberManager subscribers={subscribers || []} />

      <div style={{ marginTop: "48px" }}>
        <BroadcastForm subscriberCount={count || 0} waCount={waCount} />
      </div>
    </div>
  );
}
