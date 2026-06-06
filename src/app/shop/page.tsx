import Image from "next/image";
import Link from "next/link";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";

  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Henima Shop</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-50 font-display">Koleksi Parfum</h1>
        <p className="mt-3 text-ink-300 max-w-xl mx-auto">
          Temukan parfum signature pilihan kamu. Pembelian satuan tersedia untuk semua varian.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const variants = product.variants.filter((v) => v.active);
          const minPrice = variants.length > 0
            ? Math.min(...variants.map((v) => v.originalPrice))
            : product.originalPrice;
          const waText = encodeURIComponent(
            "Halo Henima, saya ingin membeli " + product.name + " satuan. Boleh info ketersediaan dan cara ordernya?"
          );
          return (
            <div key={product.id} className="group overflow-hidden rounded-3xl border border-ink-800 bg-ink-950/50 hover:border-gold-400/40 transition-all duration-300">
              <div className="relative h-72 bg-ink-900 overflow-hidden cursor-pointer">
                <Image
                  src={product.photo}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink-50 font-display">{product.name}</h2>
                  {product.description && (
                    <p className="mt-1 text-sm text-ink-300 line-clamp-2">{product.description}</p>
                  )}
                </div>
                {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                  <div className="space-y-1 border-t border-ink-800 pt-3">
                    {(product as any).topNotes && (
                      <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Top:</span> {(product as any).topNotes}</p>
                    )}
                    {(product as any).middleNotes && (
                      <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Middle:</span> {(product as any).middleNotes}</p>
                    )}
                    {(product as any).baseNotes && (
                      <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Base:</span> {(product as any).baseNotes}</p>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <span key={v.id} className="rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs text-ink-200">
                      {v.sizeMl}ml
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ink-800">
                  <div>
                    <p className="text-xs text-ink-500">Mulai dari</p>
                    {(product as any).comingSoon ? (
                      <span className="inline-block rounded-full bg-gold-400/10 border border-gold-400/30 px-3 py-1 text-xs font-semibold text-gold-300">Coming Soon</span>
                    ) : (
                      <p className="text-xl font-bold text-gold-300">Rp {minPrice.toLocaleString("id-ID")}</p>
                    )}
                  </div>
                  
                  <a
                  href={"https://wa.me/" + waNumber + "?text=" + waText}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-2 !px-4 text-sm"
                  >
                    Beli Sekarang
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 p-10 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Mau jual juga?</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink-50 font-display">Bergabung sebagai Reseller</h2>
        <p className="mt-2 text-ink-300">Dapatkan harga khusus grosir dan mulai bisnis parfummu.</p>
        <Link href="/daftar" className="btn-primary mt-6 inline-block px-8 py-3">Daftar Reseller</Link>
      </div>
    </div>
  );
}
