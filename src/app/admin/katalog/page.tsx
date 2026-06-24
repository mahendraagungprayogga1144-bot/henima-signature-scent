import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";
import CatalogManager from "./CatalogManager";

export default async function AdminKatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();
  const catalog = (db.settings as any).catalog ?? { images: [], pdfUrl: "", title: "Katalog Produk" };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mt-4 text-2xl font-bold">Kelola Katalog Digital</h1>
      <p className="mt-1 text-ink-300">Upload halaman katalog yang bisa dilihat publik.</p>
      <div className="mt-8">
        <CatalogManager catalog={catalog} />
      </div>
    </div>
  );
}
