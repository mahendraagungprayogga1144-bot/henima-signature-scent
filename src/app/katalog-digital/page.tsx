import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";

export default async function KatalogDigitalPage() {
  const db = await getDatabase();
  const catalog = db.settings.catalog;
  const company = db.settings.company;
  const waNumber = company.whatsappNumber || "6285190311230";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
          {company.name}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-50">
          {catalog?.title || "Katalog Produk"}
        </h1>
        <p className="mt-3 text-ink-400">
          Temukan koleksi parfum premium kami. Cocok untuk reseller dan pecinta wewangian.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {catalog?.pdfUrl && (
            <a
              href={catalog.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              ⬇️ Download Katalog PDF
            </a>
          )}
          
            href={"https://wa.me/" + waNumber}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            📱 Order via WhatsApp
          </a>
          <Link href="/daftar" className="btn-secondary">
            Jadi Reseller
          </Link>
        </div>
      </div>

      {catalog?.images && catalog.images.length > 0 ? (
        <div className="space-y-4">
          {catalog.images.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-ink-800"
            >
              <Image
                src={img}
                alt={`Halaman katalog ${i + 1}`}
                width={900}
                height={1200}
                className="w-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-800 bg-ink-950/30 p-16 text-center">
          <p className="text-4xl">📖</p>
          <p className="mt-4 text-lg font-semibold text-ink-50">Katalog segera hadir</p>
          <p className="mt-2 text-ink-400">
            Admin sedang mempersiapkan katalog digital. Hubungi kami untuk info produk.
          </p>
          
            href={"https://wa.me/" + waNumber}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6 inline-block"
          >
            📱 Hubungi via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
