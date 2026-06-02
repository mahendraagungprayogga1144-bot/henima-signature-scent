import Link from "next/link";
import { getCurrentUserSafe } from "@/lib/session";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import Image from "next/image";

export default async function HomePage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "reseller") redirect("/katalog");

  const db = await getDatabase();
  const company = db.settings.company;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[28px] border border-ink-800 bg-gradient-to-b from-ink-950 via-ink-950 to-ink-900/70 p-8 sm:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="absolute -bottom-24 right-8 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />
        </div>
        {company.heroImage && (
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <Image src={company.heroImage} alt="Hero" fill className="object-cover" />
          </div>
        )}
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-950/60 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-ink-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {company.name.toUpperCase()}
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-ink-50 sm:text-6xl">
            {company.tagline || "Luxury scent, crafted for your signature."}
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
            Portal reseller resmi <span className="text-ink-100">{company.name}</span> untuk
            pemesanan cepat, harga khusus, dan pelacakan status sampai terkirim.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/masuk" className="btn-primary">
              Masuk Reseller
            </Link>
            <Link href="/daftar" className="btn-secondary">
              Daftar Reseller
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2 text-xs text-ink-400">
            <span className="badge">Katalog premium</span>
            <span className="badge">Pembayaran QRIS & Transfer</span>
            <span className="badge">Status & notifikasi</span>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-50">
              Product showcase
            </h2>
            <p className="text-muted">
              Pilihan favorit untuk display katalog dan materi promosi reseller.
            </p>
          </div>
          <Link href="/daftar" className="text-sm font-semibold text-gold-300 hover:text-gold-200">
            Mulai jadi reseller →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Elegant packaging",
              desc: "Tampilan premium yang konsisten untuk pengalaman unboxing.",
            },
            {
              title: "Signature notes",
              desc: "Aroma seimbang, wearable, dan mudah direkomendasikan.",
            },
            {
              title: "Reseller-ready",
              desc: "Checkout cepat, status jelas, dan arsip pesanan rapi.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card relative overflow-hidden p-6"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
              <h3 className="relative text-lg font-semibold text-ink-50">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-ink-50">How it works</h3>
          <ol className="mt-4 space-y-3 text-sm text-ink-300">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-800 bg-ink-950 text-xs font-semibold text-gold-300">
                1
              </span>
              <span>Daftar reseller dan masuk ke portal.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-800 bg-ink-950 text-xs font-semibold text-gold-300">
                2
              </span>
              <span>Pilih produk, buat pesanan, dan lengkapi pengiriman.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-800 bg-ink-950 text-xs font-semibold text-gold-300">
                3
              </span>
              <span>Bayar via QRIS/transfer, unggah bukti, lalu pantau status.</span>
            </li>
          </ol>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-ink-50">Built for resellers</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { k: "Harga khusus", v: "Skema grosir untuk reseller." },
              { k: "Pengiriman cepat", v: "Pilih kurir, resi, dan tracking." },
              { k: "Pembayaran fleksibel", v: "QRIS dan multi-bank transfer." },
              { k: "Notifikasi otomatis", v: "WhatsApp + email backup." },
            ].map((f) => (
              <div key={f.k} className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
                <p className="text-sm font-semibold text-ink-50">{f.k}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-300">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(company.vision || company.mission || company.brandStory) && (
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-ink-50">Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              {company.vision || "-"}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-ink-50">Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              {company.mission || "-"}
            </p>
          </div>
          <div className="card lg:col-span-1">
            <h3 className="text-lg font-semibold text-ink-50">Brand story</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              {company.brandStory || "-"}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
