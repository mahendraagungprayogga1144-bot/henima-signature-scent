import Link from "next/link";
import Image from "next/image";
import ProductImageZoom from "@/components/ProductImageZoom";
import ScrollReveal from "@/components/ScrollReveal";
import { getCurrentUserSafe } from "@/lib/session";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "reseller") redirect("/katalog");

  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);

  return (
    <div className="min-h-screen space-y-0">

      {/* HERO EDITORIAL SPLIT SCREEN */}
      <section className="relative min-h-[90vh] grid lg:grid-cols-2 overflow-hidden rounded-[28px] border border-ink-800">
        <div className="relative flex flex-col justify-between bg-ink-950 px-8 sm:px-14 py-14">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] text-ink-400 uppercase">{company.name}</p>
          </div>
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light italic text-ink-50 leading-none font-display">
              Worn.<br />Not<br />Forgotten.
            </h1>
            <p className="text-base text-ink-300 max-w-sm leading-relaxed">
              {company.tagline || "Setiap tetes adalah cerita. Setiap aroma adalah kenangan yang tidak terlupakan."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary px-8 py-3">Explore Koleksi</Link>
              <Link href="/daftar" className="btn-secondary px-6 py-3 text-sm">Jadi Reseller</Link>
            </div>
          </div>
          <div className="flex gap-8 text-xs text-ink-500 tracking-widest uppercase mt-8">
            <span>Est. {(company as any).foundingYear || "2024"}</span>
            <span>Indonesia</span>
            <span>Signature Scent</span>
          </div>
        </div>
        <div className="relative min-h-[50vh] lg:min-h-full bg-ink-900 overflow-hidden">
          {products.length > 0 && products[0].photo ? (
            <>
              <Image src={products[0].photo} alt={products[0].name} fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-xs tracking-[0.3em] text-ink-300 uppercase">{products[0].name}</p>
                {(products[0] as any).comingSoon ? (
                  <p className="mt-1 text-sm text-gold-300 tracking-widest uppercase">Coming Soon</p>
                ) : (
                  <p className="mt-1 text-2xl font-light text-ink-50 font-display">Rp {products[0].discountPrice.toLocaleString("id-ID")}</p>
                )}
              </div>
            </>
          ) : company.heroImage ? (
            <>
              <Image src={company.heroImage} alt="Hero" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-ink-950/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900 to-ink-950 flex items-center justify-center">
              <p className="text-9xl font-display font-light italic text-ink-800">H</p>
            </div>
          )}
        </div>
      </section>

      {/* PRODUK */}
      {products.length > 0 && (
        <ScrollReveal>
          <section className="mt-20 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.3em] text-ink-400 uppercase">Koleksi</p>
                <h2 className="mt-1 text-3xl font-light italic text-ink-50 font-display">Produk Kami</h2>
              </div>
              <Link href="/shop" className="text-sm text-ink-300 hover:text-ink-50 tracking-widest uppercase">Lihat Semua</Link>
            </div>
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
                        <h3 className="text-lg font-light italic text-ink-50 font-display">{product.name}</h3>
                        <p className="mt-1 text-sm text-ink-300 line-clamp-2">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-ink-500 tracking-widest uppercase">Harga Reseller</p>
                            {(product as any).comingSoon ? (
                              <span className="inline-block rounded-full bg-gold-400/10 border border-gold-400/30 px-3 py-1 text-xs font-semibold text-gold-300 mt-1">Coming Soon</span>
                            ) : (
                              <p className="text-lg font-light text-gold-300 font-display">
                                {"Rp " + minPrice.toLocaleString("id-ID") + (maxPrice > minPrice ? " — " + maxPrice.toLocaleString("id-ID") : "")}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {variants.map((v) => (
                              <span key={v.id} className="rounded-full border border-ink-700 bg-ink-900 px-2 py-0.5 text-xs text-ink-300">{v.sizeMl}ml</span>
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
        </ScrollReveal>
      )}

      {/* CARA JADI RESELLER */}
      <ScrollReveal delay={100}>
        <section className="mt-24">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] text-ink-400 uppercase">Bergabung</p>
            <h2 className="mt-1 text-3xl font-light italic text-ink-50 font-display">Cara Jadi Reseller</h2>
            <p className="mt-2 text-ink-300">Mulai berjualan dalam 3 langkah mudah.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", title: "Daftar Gratis", desc: "Buat akun reseller dan langsung akses katalog harga khusus." },
              { step: "02", title: "Pilih dan Pesan", desc: "Pilih produk, kurir, isi alamat — ongkir otomatis dihitung." },
              { step: "03", title: "Bayar dan Kirim", desc: "Bayar via QRIS/transfer, upload bukti, pantau status real-time." },
            ].map((item, idx) => (
              <ScrollReveal key={item.step} delay={idx * 150} direction="up">
                <div className="relative rounded-3xl border border-ink-800 bg-ink-950/50 p-8 overflow-hidden hover:border-gold-400/30 transition-all duration-500">
                  <div className="absolute -right-4 -top-4 text-8xl font-black text-ink-800/60 select-none font-display">{item.step}</div>
                  <div className="relative">
                    <h3 className="text-lg font-medium text-ink-50">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* TENTANG KAMI */}
      {(company.brandStory || company.vision || company.mission || (company.team && (company.team as any[]).length > 0) || (company.advantages && (company.advantages as any[]).length > 0)) && (
        <section className="mt-24 space-y-16">
          <ScrollReveal direction="fade">
            <div className="text-center">
              <p className="text-xs font-medium tracking-[0.3em] text-ink-400 uppercase">Our Story</p>
              <h2 className="mt-2 text-3xl font-light italic text-ink-50 font-display">
                {company.name}
                {(company as any).foundingYear && <span className="ml-3 text-lg text-ink-400 not-italic"> · est. {(company as any).foundingYear}</span>}
              </h2>
            </div>
          </ScrollReveal>
          {company.brandStory && (
            <ScrollReveal direction="up" delay={100}>
              <div className="mx-auto max-w-3xl rounded-3xl border border-gold-400/20 bg-gradient-to-b from-ink-950/60 to-ink-900/30 p-10">
                <p className="text-center text-xl leading-relaxed text-ink-50 italic font-light font-display">"{company.brandStory}"</p>
              </div>
            </ScrollReveal>
          )}
          {(company.vision || company.mission) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {company.vision && (
                <ScrollReveal direction="left">
                  <div className="rounded-3xl border border-ink-700 bg-ink-900 p-8 h-full border-l-4 border-l-gold-400">
                    <p className="text-xs font-medium tracking-[0.2em] text-gold-400 uppercase">Visi</p>
                    <p className="mt-4 text-ink-50 leading-relaxed">{company.vision}</p>
                  </div>
                </ScrollReveal>
              )}
              {company.mission && (
                <ScrollReveal direction="right" delay={100}>
                  <div className="rounded-3xl border border-ink-700 bg-ink-900 p-8 h-full border-l-4 border-l-gold-400">
                    <p className="text-xs font-medium tracking-[0.2em] text-gold-400 uppercase">Misi</p>
                    <p className="mt-4 text-ink-50 leading-relaxed text-sm">{company.mission}</p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          )}
          {company.advantages && (company.advantages as any[]).length > 0 && (
            <div>
              <ScrollReveal direction="fade">
                <h3 className="text-center text-2xl font-light italic text-ink-50 font-display mb-8">Keunggulan Produk</h3>
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-3">
                {(company.advantages as any[]).map((adv: any, idx: number) => (
                  <ScrollReveal key={adv.id} delay={idx * 120} direction="up">
                    <div className="rounded-3xl border border-ink-800 bg-ink-950/50 p-8 text-center hover:border-gold-400/30 transition-all duration-500 group">
                      <p className="text-5xl group-hover:scale-110 transition-transform duration-300">{adv.icon}</p>
                      <p className="mt-4 font-medium text-ink-50">{adv.title}</p>
                      <p className="mt-2 text-sm text-ink-300 leading-relaxed">{adv.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
          {company.team && (company.team as any[]).length > 0 && (
            <div>
              <ScrollReveal direction="fade">
                <h3 className="text-center text-2xl font-light italic text-ink-50 font-display mb-8">Tim Kami</h3>
              </ScrollReveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(company.team as any[]).map((member: any, idx: number) => (
                  <ScrollReveal key={member.id} delay={idx * 120} direction="up">
                    <div className="rounded-3xl border border-ink-800 bg-ink-950/50 p-8 text-center hover:border-gold-400/30 transition-all duration-500">
                      <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-gold-400/30 bg-ink-900">
                        {member.photo ? <Image src={member.photo} alt={member.name} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl">👤</div>}
                      </div>
                      <p className="mt-5 font-medium text-ink-50">{member.name}</p>
                      <p className="text-sm text-gold-300">{member.role}</p>
                      {member.bio && <p className="mt-3 text-xs text-ink-300 leading-relaxed">{member.bio}</p>}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* RESELLER BAND */}
      <ScrollReveal direction="up" delay={100}>
        <section className="mt-24 rounded-[28px] border border-ink-800 bg-ink-950/50 p-10 sm:p-14">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] text-gold-400 uppercase">Partner Program</p>
              <h2 className="mt-2 text-3xl font-light italic text-ink-50 font-display">Become a Henima Partner</h2>
              <p className="mt-3 text-ink-300">Bergabung sebagai reseller eksklusif Henima. Dapatkan harga khusus, materi promosi, dan dukungan penuh.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link href="/daftar" className="btn-primary px-8 py-3">Daftar Sekarang</Link>
              <a href={"https://wa.me/6285190311230"} target="_blank" rel="noreferrer" className="btn-secondary px-8 py-3">Hubungi Kami</a>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
