import Link from "next/link";
import Image from "next/image";
import { getCurrentUserSafe } from "@/lib/session";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";

export default async function HomePage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "reseller") redirect("/katalog");

  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);

  return (
    <div className="min-h-screen">

      <section className="relative overflow-hidden rounded-[28px] border border-ink-800 bg-ink-950 min-h-[80vh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold-400/10 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-brand-400/10 blur-[80px]" />
        </div>
        <div className="relative w-full grid lg:grid-cols-2 gap-12 items-center px-8 sm:px-12 py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              {company.name.toUpperCase()}
            </p>
            <h1 className="mt-6 text-5xl sm:text-6xl font-semibold tracking-tight text-ink-50 leading-tight">
              {company.tagline || "Luxury scent, crafted for your signature."}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-300 max-w-lg">
              Portal reseller resmi <span className="text-gold-300 font-medium">{company.name}</span> — harga khusus grosir, pengiriman ke seluruh Indonesia, status real-time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/masuk" className="btn-primary px-8 py-3 text-base">
                Masuk Reseller
              </Link>
              <Link href="/daftar" className="btn-secondary px-8 py-3 text-base">
                Daftar Gratis
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-ink-400">
              <span>✓ Harga grosir khusus reseller</span>
              <span>✓ Kirim ke seluruh Indonesia</span>
              <span>✓ QRIS & Transfer Bank</span>
            </div>
          </div>
          {products.length > 0 && (
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {products.slice(0, 2).map((product, i) => (
                <div key={product.id} className={`relative overflow-hidden rounded-3xl border border-ink-700 bg-ink-900 aspect-[3/4] ${i === 1 ? "mt-8" : ""}`}>
                  <Image src={product.photo} alt={product.name} fill className="object-contain p-6" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4">
                    <p className="font-semibold text-ink-50 text-sm">{product.name}</p>
                    <p className="text-xs text-gold-300">Rp {product.discountPrice.toLocaleString("id-ID")} / unit</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="mt-16 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-ink-50">Produk Kami</h2>
              <p className="mt-1 text-ink-400">Parfum premium siap jual untuk reseller.</p>
            </div>
            <Link href="/daftar" className="text-sm font-semibold text-gold-300 hover:text-gold-200 hover:underline">Jadi reseller →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = Math.min(...variants.map((v) => v.discountPrice));
              const maxPrice = Math.max(...variants.map((v) => v.discountPrice));
              return (
                <div key={product.id} className="group relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-950/50 hover:border-gold-400/40 transition-all duration-300">
                  <div className="relative h-64 bg-ink-900 overflow-hidden">
                    <Image src={product.photo} alt={product.name} fill className="object-contain p-8 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink-50">{product.name}</h3>
                    <p className="mt-1 text-sm text-ink-400 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-ink-500">Harga reseller</p>
                        <p className="text-lg font-bold text-gold-300">
                          Rp {minPrice.toLocaleString("id-ID")}{maxPrice > minPrice && ` – ${maxPrice.toLocaleString("id-ID")}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {variants.map((v) => (
                          <span key={v.id} className="rounded-full border border-ink-700 bg-ink-900 px-2 py-0.5 text-xs text-ink-300">{v.sizeMl}ml</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-ink-50">Cara Jadi Reseller</h2>
          <p className="mt-2 text-ink-400">Mulai berjualan dalam 3 langkah mudah.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Daftar Gratis", desc: "Buat akun reseller dan langsung akses katalog harga khusus." },
            { step: "02", title: "Pilih & Pesan", desc: "Pilih produk, kurir, isi alamat — ongkir otomatis dihitung." },
            { step: "03", title: "Bayar & Kirim", desc: "Bayar via QRIS/transfer, upload bukti, pantau status real-time." },
          ].map((item) => (
            <div key={item.step} className="relative card p-6 overflow-hidden">
              <div className="absolute -right-4 -top-4 text-7xl font-black text-ink-800 select-none">{item.step}</div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-ink-50">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[28px] border border-gold-400/20 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 p-10 sm:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink-50">Siap mulai berjualan?</h2>
          <p className="mt-3 text-ink-400 text-lg">Daftar sekarang dan dapatkan akses ke harga reseller eksklusif.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/daftar" className="btn-primary px-10 py-3 text-base">
              Daftar Reseller Sekarang
            </Link>
            
              href="https://wa.me/6285190311230?text=Halo%2C%20saya%20ingin%20jadi%20reseller%20Henima%20Signature%20Scent"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary px-10 py-3 text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.07a.5.5 0 0 0 .611.611l5.22-1.471A11.96 11.96 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22A9.994 9.994 0 0 1 6.022 20.2l-.368-.22-3.818 1.075 1.075-3.818-.22-.368A9.994 9.994 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
