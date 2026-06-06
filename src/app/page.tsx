import Link from "next/link";
import Image from "next/image";
import ProductImageZoom from "@/components/ProductImageZoom";
import ScrollReveal from "@/components/ScrollReveal";
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
        {company.heroImage && (
          <div className="absolute inset-0">
            <Image src={company.heroImage} alt="Hero Background" fill className="object-cover" />
            <div className="absolute inset-0 bg-ink-950/70" />
          </div>
        )}
        <div className="relative w-full grid lg:grid-cols-2 gap-12 items-center px-8 sm:px-12 py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              {company.name.toUpperCase()}
            </p>
            <h1 className="mt-6 text-5xl sm:text-6xl font-semibold tracking-tight text-ink-50 leading-tight font-display">
              {company.tagline || "Luxury scent, crafted for your signature."}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-100 max-w-lg">
              Portal reseller resmi <span className="text-gold-300 font-medium">{company.name}</span> — harga khusus grosir, pengiriman ke seluruh Indonesia, status real-time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/masuk" className="btn-primary px-8 py-3 text-base">Masuk Reseller</Link>
              <Link href="/daftar" className="btn-secondary px-8 py-3 text-base">Daftar Gratis</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-ink-200">
              <span className="text-ink-200">✓ Harga grosir khusus reseller</span>
              <span className="text-ink-200">✓ Kirim ke seluruh Indonesia</span>
              <span className="text-ink-200">✓ QRIS dan Transfer Bank</span>
            </div>
          </div>

      {products.length > 0 && (
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {products.slice(0, 2).map((product, i) => (
                <div key={product.id} className={"relative overflow-hidden rounded-3xl border border-ink-700 bg-ink-900 aspect-[3/4] " + (i === 1 ? "mt-8" : "")}>
                  <ProductImageZoom src={product.photo} alt={product.name} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4">
                    <p className="font-semibold text-ink-50 text-sm">{product.name}</p>
                    <p className="text-xs text-gold-300">
                      {(product as any).comingSoon ? "Coming Soon" : ("Rp " + product.discountPrice.toLocaleString("id-ID") + " / unit")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="mt-20 space-y-8">
          <ScrollReveal direction="up">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Koleksi</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50 font-display">Produk Kami</h2>
                <p className="mt-1 text-ink-200">Parfum premium siap jual untuk reseller.</p>
              </div>
              <Link href="/daftar" className="text-sm font-semibold text-gold-300 hover:text-gold-200 hover:underline">Jadi reseller</Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, idx) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.discountPrice)) : product.discountPrice;
              const maxPrice = variants.length > 0 ? Math.max(...variants.map((v) => v.discountPrice)) : product.discountPrice;
              return (
                <ScrollReveal key={product.id} delay={idx * 120} direction="up">
                  <div className="group relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-950/50 hover:border-gold-400/40 transition-all duration-500">
                    <div className="relative h-72 bg-ink-900 overflow-hidden">
                      <ProductImageZoom src={product.photo} alt={product.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent pointer-events-none" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-ink-50">{product.name}</h3>
                      <p className="mt-1 text-sm text-ink-200 line-clamp-2">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-ink-300">Harga reseller</p>
                          {(product as any).comingSoon ? (
                            <span className="inline-block rounded-full bg-gold-400/10 border border-gold-400/30 px-3 py-1 text-xs font-semibold text-gold-300">Coming Soon</span>
                          ) : (
                            <p className="text-lg font-bold text-gold-300">
                              {"Rp " + minPrice.toLocaleString("id-ID") + (maxPrice > minPrice ? " - " + maxPrice.toLocaleString("id-ID") : "")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {variants.map((v) => (
                            <span key={v.id} className="rounded-full border border-ink-700 bg-ink-900 px-2 py-0.5 text-xs text-ink-200">{v.sizeMl}ml</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-24">
        <ScrollReveal direction="fade">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Bergabung</p>
            <h2 className="mt-1 text-3xl font-semibold text-ink-50 font-display">Cara Jadi Reseller</h2>
            <p className="mt-2 text-ink-200">Mulai berjualan dalam 3 langkah mudah.</p>
          </div>
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Daftar Gratis", desc: "Buat akun reseller dan langsung akses katalog harga khusus." },
            { step: "02", title: "Pilih dan Pesan", desc: "Pilih produk, kurir, isi alamat — ongkir otomatis dihitung." },
            { step: "03", title: "Bayar dan Kirim", desc: "Bayar via QRIS/transfer, upload bukti, pantau status real-time." },
          ].map((item, idx) => (
            <ScrollReveal key={item.step} delay={idx * 150} direction="up">
              <div className="relative card p-8 overflow-hidden hover:border-gold-400/30 transition-all duration-500">
                <div className="absolute -right-4 -top-4 text-8xl font-black text-ink-800/60 select-none">{item.step}</div>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mb-4">
                    <span className="text-xs font-bold text-gold-300">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink-50">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-200 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {(company.brandStory || company.vision || company.mission || (company.team && (company.team as any[]).length > 0) || (company.advantages && (company.advantages as any[]).length > 0)) && (
        <section className="mt-24 space-y-16">
          <ScrollReveal direction="fade">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Our Story</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink-50 font-display">
                {company.name}
                {(company as any).foundingYear && <span className="ml-3 text-lg text-ink-300">est. {(company as any).foundingYear}</span>}
              </h2>
            </div>
          </ScrollReveal>

          {company.brandStory && (
            <ScrollReveal direction="up" delay={100}>
              <div className="mx-auto max-w-3xl rounded-3xl border border-gold-400/20 bg-gradient-to-b from-ink-950/60 to-ink-900/30 p-10">
                <p className="text-center text-2xl leading-relaxed text-ink-50 italic font-light font-display">"{company.brandStory}"</p>
              </div>
            </ScrollReveal>
          )}

          {(company.vision || company.mission) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {company.vision && (
                <ScrollReveal direction="left" delay={0}>
                  <div className="rounded-3xl border border-ink-700 bg-ink-900 p-8 h-full border-l-4 border-l-gold-400">
                    <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Visi</p>
                    <p className="mt-4 text-ink-50 leading-relaxed text-base">{company.vision}</p>
                  </div>
                </ScrollReveal>
              )}
              {company.mission && (
                <ScrollReveal direction="right" delay={100}>
                  <div className="rounded-3xl border border-ink-700 bg-ink-900 p-8 h-full border-l-4 border-l-gold-400">
                    <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Misi</p>
                    <p className="mt-4 text-ink-50 leading-relaxed text-sm">{company.mission}</p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          )}

          {company.advantages && (company.advantages as any[]).length > 0 && (
            <div>
              <ScrollReveal direction="fade">
                <h3 className="text-center text-2xl font-semibold text-ink-50 mb-8">Keunggulan Produk</h3>
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-3">
                {(company.advantages as any[]).map((adv: any, idx: number) => (
                  <ScrollReveal key={adv.id} delay={idx * 120} direction="up">
                    <div className="card p-8 text-center hover:border-gold-400/30 transition-all duration-500 group">
                      <p className="text-5xl group-hover:scale-110 transition-transform duration-300">{adv.icon}</p>
                      <p className="mt-4 font-semibold text-ink-50 text-lg">{adv.title}</p>
                      <p className="mt-2 text-sm text-ink-200 leading-relaxed">{adv.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {company.team && (company.team as any[]).length > 0 && (
            <div>
              <ScrollReveal direction="fade">
                <h3 className="text-center text-2xl font-semibold text-ink-50 mb-8">Tim Kami</h3>
              </ScrollReveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(company.team as any[]).map((member: any, idx: number) => (
                  <ScrollReveal key={member.id} delay={idx * 120} direction="up">
                    <div className="card p-8 text-center hover:border-gold-400/30 transition-all duration-500">
                      <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-gold-400/30 bg-ink-900">
                        {member.photo
                          ? <Image src={member.photo} alt={member.name} fill className="object-cover" />
                          : <div className="flex h-full w-full items-center justify-center text-4xl">person</div>
                        }
                      </div>
                      <p className="mt-5 font-semibold text-ink-50 text-lg">{member.name}</p>
                      <p className="text-sm text-gold-300">{member.role}</p>
                      {member.bio && <p className="mt-3 text-xs text-ink-200 leading-relaxed">{member.bio}</p>}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <ScrollReveal direction="up" delay={100}>
        <section className="mt-24 rounded-[28px] border border-gold-400/20 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gold-400/10 blur-[80px]" />
          </div>
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Bergabung Sekarang</p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-semibold text-ink-50 font-display">Siap mulai berjualan?</h2>
            <p className="mt-4 text-ink-200 text-lg max-w-xl mx-auto">Daftar sekarang dan dapatkan akses ke harga reseller eksklusif.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/daftar" className="btn-primary px-10 py-4 text-base">Daftar Reseller Sekarang</Link>
              <a href={"https://wa.me/6285190311230"} target="_blank" rel="noreferrer" className="btn-secondary px-10 py-4 text-base">Hubungi via WhatsApp</a>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
