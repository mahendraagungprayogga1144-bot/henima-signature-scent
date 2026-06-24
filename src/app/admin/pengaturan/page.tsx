import Link from "next/link";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { getCurrentUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm text-gold-300 hover:text-gold-200 hover:underline">
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Pengaturan</h1>
      <p className="mt-1 text-ink-300">Kelola info perusahaan, QRIS, dan rekening bank.</p>

      <div className="mt-8">
        <SettingsForm settings={db.settings} />
      </div>
    </div>
  );
}

