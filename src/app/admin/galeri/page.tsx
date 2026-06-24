import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";
import GalleryManager from "./GalleryManager";

export default async function AdminGaleriPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();
  const gallery = (db.settings as any).gallery ?? { images: [], title: "Galeri" };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mt-4 text-2xl font-bold">Kelola Galeri</h1>
      <p className="mt-1 text-ink-300">Upload foto produk, packaging, dan momen brand.</p>
      <div className="mt-8">
        <GalleryManager gallery={gallery} />
      </div>
    </div>
  );
}
