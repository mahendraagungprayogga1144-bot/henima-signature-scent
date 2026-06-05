import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import AdminCharts from "@/components/admin/AdminCharts";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();
  const pendingOrders = db.orders.filter((o) => o.status === "pending_confirmation").length;
  const totalOrders = db.orders.length;
  const resellers = db.users.filter((u) => u.role === "reseller").length;
  const revenue = db.orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.total, 0);

  const todayKey = new Date().toISOString().slice(0, 10);
  const ordersToday = db.orders.filter((o) => o.createdAt.startsWith(todayKey)).length;
  const revenueToday = db.orders
    .filter((o) => (o.paymentConfirmedAt || "").startsWith(todayKey))
    .reduce((s, o) => s + o.total, 0);

  const ordersByStatus = Object.entries(
    db.orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * dayMs);
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" }) };
  });
  const revenueByDay = last30.map(({ key, label }) => {
    const rev = db.orders
      .filter((o) => o.status === "delivered" && o.updatedAt?.startsWith(key))
      .reduce((s, o) => s + o.total, 0);
    return { day: label, revenue: rev };
  });

  const delivered = db.orders.filter((o) => o.status === "delivered");
  const resellerRevenue = delivered.reduce((acc, o) => {
    acc[o.resellerId] = (acc[o.resellerId] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);
  const topResellers = Object.entries(resellerRevenue)
    .map(([id, rev]) => {
      const u = db.users.find((x) => x.id === id);
      return { name: (u?.storeName || u?.name || id).slice(0, 12), revenue: rev };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      <p className="text-stone-600">Kelola pesanan, produk, dan reseller</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pesanan Hari Ini", value: ordersToday, href: "/admin/pesanan" },
          { label: "Revenue Hari Ini", value: formatRupiah(revenueToday), href: "/admin/pesanan" },
          { label: "Pending Payment", value: pendingOrders, href: "/admin/pesanan" },
          { label: "Reseller", value: resellers, href: "/admin/reseller" },
          { label: "Total Pesanan", value: totalOrders, href: "/admin/pesanan" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card hover:border-brand-300">
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-700">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/pesanan" className="card text-center hover:bg-brand-50">
          <span className="text-lg font-semibold">Kelola Pesanan</span>
        </Link>
        <Link href="/admin/produk" className="card text-center hover:bg-brand-50">
          <span className="text-lg font-semibold">Kelola Produk</span>
        </Link>
        <Link href="/admin/reseller" className="card text-center hover:bg-brand-50">
          <span className="text-lg font-semibold">Kelola Reseller</span>
        </Link>
        <Link href="/admin/katalog">
              Katalog Digital
            </Link>
            <Link
              href="/admin/pengaturan" className="card text-center hover:bg-brand-50">
          <span className="text-lg font-semibold">Pengaturan</span>
        </Link>
      </div>

      {db.orders.length > 0 && (
        <div className="mt-10">
          <AdminCharts ordersByStatus={ordersByStatus} revenueByDay={revenueByDay} topResellers={topResellers} />
        </div>
      )}

      {db.orders.length > 0 && (
        <div className="card mt-10">
          <h2 className="font-semibold">Pesanan Terbaru</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {db.orders
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 5)
              .map((order) => (
                <li key={order.id} className="flex justify-between py-3 text-sm">
                  <Link href={`/pesanan/${order.id}`} className="font-mono hover:text-brand-700">
                    {order.id}
                  </Link>
                  <span>{ORDER_STATUS_LABELS[order.status]}</span>
                  <span>{formatRupiah(order.total)}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
