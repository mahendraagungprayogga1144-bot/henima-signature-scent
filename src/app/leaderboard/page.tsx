import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");

  const db = await getDatabase();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const deliveredThisMonth = db.orders.filter(
    (o) => o.status === "delivered" && (o.updatedAt || o.createdAt).slice(0, 10) >= monthStart
  );

  const byReseller = new Map<
    string,
    { resellerId: string; name: string; store: string; revenue: number; orders: number }
  >();

  for (const o of deliveredThisMonth) {
    const prev = byReseller.get(o.resellerId) || {
      resellerId: o.resellerId,
      name: o.resellerName,
      store: o.storeName,
      revenue: 0,
      orders: 0,
    };
    prev.revenue += o.total;
    prev.orders += 1;
    byReseller.set(o.resellerId, prev);
  }

  const top = [...byReseller.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Leaderboard Reseller</h1>
      <p className="mt-1 text-ink-300">Top reseller bulan ini (berdasarkan omzet terkirim).</p>

      {top.length === 0 ? (
        <p className="mt-8 text-ink-300">Belum ada pesanan terkirim bulan ini.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-950/40">
              <tr className="text-ink-300">
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Reseller</th>
                <th className="px-4 py-3 font-medium">Toko</th>
                <th className="px-4 py-3 font-medium">Pesanan</th>
                <th className="px-4 py-3 font-medium">Omzet</th>
              </tr>
            </thead>
            <tbody>
              {top.map((r, idx) => (
                <tr key={r.resellerId} className="border-t border-ink-800">
                  <td className="px-4 py-3 font-semibold text-gold-200">#{idx + 1}</td>
                  <td className="px-4 py-3 text-ink-50">{r.name}</td>
                  <td className="px-4 py-3 text-ink-200">{r.store}</td>
                  <td className="px-4 py-3 text-ink-200">{r.orders}</td>
                  <td className="px-4 py-3 text-ink-50">{formatRupiah(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

