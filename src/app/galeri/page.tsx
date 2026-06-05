import Image from "next/image";
import Link from "next/link";
import { getDatabase } from "@/lib/db";

export default async function GaleriPage() {
  const db = await getDatabase();
  const gallery = (db.settings as any).gallery ?? { images: [], title: "Galeri" };
  const company = db.settings.company;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">{company.name}</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-50">{gallery.title || "Galeri"}</h1>
        <p className="mt-3 text-ink-400">Momen, produk, dan cerita di balik {company.name}.</p>
      </div>

      {gallery.images && gallery.images.length > 0 ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {gallery.images.map((img: any, i: number) => (
            <div key={i} className="break-inside-avoid overflow-hidden rounded-2xl border border-ink-800">
              <Image
                src={typeof img === "string" ? img : img.url}
                alt={typeof img === "object" ? img.caption || "Galeri" : "Galeri"}
                width={400}
                height={400}
                className="w-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {typeof img === "object" && img.caption && (
                <p className="p-2 text-xs text-ink-400 text-center">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-800 bg-ink-950/30 p-16 text-center">
          <p className="text-4xl">🖼️</p>
          <p className="mt-4 text-lg font-semibold text-ink-50">Galeri segera hadir</p>
          <p className="mt-2 text-ink-400">Admin sedang mempersiapkan galeri foto.</p>
          <Link href="/daftar" className="btn-primary mt-6 inline-block">Jadi Reseller</Link>
        </div>
      )}
    </div>
  );
}
