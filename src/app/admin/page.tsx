import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  // Fetch orders dari Supabase
  const { data: orders } = await supabase
    .from("retail_orders")
    .select("id, status, total, created_at, customer, resi")
    .order("created_at", { ascending: false });

  const allOrders = orders || [];

  // KPI
  const totalRevenue = allOrders.filter(o => o.status === "delivered").reduce((s, o) => s + (o.total || 0), 0);
  const todayKey = new Date().toISOString().slice(0, 10);
  const revenueToday = allOrders.filter(o => o.status === "delivered" && o.created_at?.startsWith(todayKey)).reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = allOrders.filter(o => o.status === "pending_payment").length;
  const processingOrders = allOrders.filter(o => o.status === "processing" || o.status === "paid").length;
  const shippedOrders = allOrders.filter(o => o.status === "shipped").length;
  const totalOrders = allOrders.length;

  // Shipping cost
  const shippingToday = allOrders.filter(o => o.created_at?.startsWith(todayKey)).reduce((s, o) => s + (o.shipping_cost || 0), 0);
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const shippingThisMonth = allOrders.filter(o => o.created_at?.startsWith(thisMonthKey)).reduce((s, o) => s + (o.shipping_cost || 0), 0);

  // Revenue 7 hari terakhir
  const now = Date.now();
  const dayMs = 86400000;
  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * dayMs);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
    const revenue = allOrders.filter(o => o.status === "delivered" && o.created_at?.startsWith(key)).reduce((s, o) => s + (o.total || 0), 0);
    const count = allOrders.filter(o => o.created_at?.startsWith(key)).length;
    return { day: label, revenue, count };
  });

  // Ulasan
  const { count: totalUlasan } = await supabase.from("product_reviews").select("*", { count: "exact", head: true }).eq("approved", true);

  const recentOrders = allOrders.slice(0, 8);

  return (
    <AdminDashboardClient
      totalRevenue={totalRevenue}
      revenueToday={revenueToday}
      totalOrders={totalOrders}
      pendingOrders={pendingOrders}
      processingOrders={processingOrders}
      shippedOrders={shippedOrders}
      shippingToday={shippingToday}
      shippingThisMonth={shippingThisMonth}
      revenueByDay={revenueByDay}
      recentOrders={recentOrders}
      totalUlasan={totalUlasan || 0}
    />
  );
}
