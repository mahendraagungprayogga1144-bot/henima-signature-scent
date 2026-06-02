import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import ResellerManager from "@/components/admin/ResellerManager";

export default async function AdminResellersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();
  const resellers = db.users.filter((u) => u.role === "reseller");

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="text-sm text-gold-300 hover:text-gold-200 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Kelola Reseller</h1>
      <p className="mt-1 text-ink-300">{resellers.length} reseller terdaftar</p>

      <div className="mt-8 space-y-6">
        {resellers.map((r) => (
          <ResellerManager key={r.id} reseller={r} />
        ))}
      </div>
    </div>
  );
}
