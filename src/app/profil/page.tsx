import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role === "admin") redirect("/admin");

  const db = await getDatabase();
  const orders = db.orders.filter((o) => o.resellerId === user.id);
  const delivered = orders.filter((o) => o.status === "delivered");
  const deliveredRevenue = delivered.reduce((s, o) => s + o.total, 0);

  const commissionPct = user.reseller?.commissionPct ?? 0;
  const commissionEarned = Math.round((deliveredRevenue * commissionPct) / 100);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Profil Reseller</h1>
      <p className="mt-1 text-ink-300">Henima Signature Scent</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card">
          <p className="text-sm text-ink-400">Nama</p>
          <p className="mt-1 text-lg font-semibold text-ink-50">{user.name}</p>
          <p className="mt-3 text-sm text-ink-400">Toko</p>
          <p className="mt-1 font-medium text-ink-100">{user.storeName}</p>
        </div>
        <div className="card">
          <p className="text-sm text-ink-400">Tier</p>
          <p className="mt-1 text-lg font-semibold text-gold-200">
            {user.reseller?.tier ?? "Bronze"}
          </p>
          <p className="mt-3 text-sm text-ink-400">Komisi</p>
          <p className="mt-1 font-medium text-ink-100">{commissionPct}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total pesanan", value: orders.length },
          { label: "Omzet terkirim", value: formatRupiah(deliveredRevenue) },
          { label: "Komisi earned", value: formatRupiah(commissionEarned) },
        ].map((k) => (
          <div key={k.label} className="card">
            <p className="text-sm text-ink-400">{k.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink-50">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/pesanan" className="btn-secondary">
          Lihat riwayat pesanan
        </Link>
        <Link href="/pesan" className="btn-primary">
          Buat pesanan baru
        </Link>
      </div>
    </div>
  );
}

