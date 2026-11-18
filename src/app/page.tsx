import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import ProductLookbookRail from "@/components/ProductLookbookRail";
import NewsletterBlock from "@/components/NewsletterBlock";
import { getPublicCatalog } from "@/lib/db";
import { getProductPhotoList } from "@/lib/product-media";

export const revalidate = 300;

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Kenzo homepage order (verified from live site):
 * 1. Hero
 * 2. Our best-sellers
 * 3. 2×2 Discover chapters (4 tiles)
 * 4. FOR A MORE BEAUTIFUL WORLD (full photo band)
 * 5. OUR STORES | Happenings
 * 6. Create a connection + Footer → di layout (kotak di atas kolom, tidak ketiban)
 */
const MEDIA = {
  hero: "/layout/hero.jpg?v=7",
  universe: "/layout/universe.jpg?v=7",
  stores: "/layout/stores.jpg?v=7",
  happenings: "/layout/happenings.jpg?v=7",
  products: [
    { id: "p1", name: "Afternoon", photo: "/layout/product-1.jpg", slug: "afternoon", line: "Henima", subtitle: "Afternoon Extrait de Parfum" },
    { id: "p2", name: "The Distance", photo: "/layout/product-2.jpg", slug: "the-distance", line: "Henima", subtitle: "The Distance Extrait de Parfum" },
    { id: "p3", name: "Signature", photo: "/layout/product-3.jpg", slug: "shop", line: "Henima", subtitle: "Signature Extrait de Parfum" },
    { id: "p4", name: "Intimate", photo: "/layout/product-4.jpg", slug: "shop", line: "Henima", subtitle: "Intimate Extrait de Parfum" },
    { id: "p5", name: "Beloved", photo: "/layout/product-5.jpg", slug: "shop", line: "Henima", subtitle: "Beloved Extrait de Parfum" },
  ],
  discover: [
    { name: "Afternoon", image: "/products/afternoon/lifestyle-car.jpg", href: "/shop/afternoon" },
    { name: "The Distance", image: "/layout/discover-2.jpg?v=6", href: "/shop" },
    { name: "Signature", image: "/layout/discover-3.jpg?v=7", href: "/shop" },
    { name: "Intimate", image: "/layout/discover-4.jpg?v=7", href: "/shop" },
  ],
};

const FUTURA =
  "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";

/** Kenzo Discover tile — lifestyle full-bleed; FuturaBT matching PDP after click. */
function DiscoverTile({
  name,
  image,
  href,
  ratio = "100%",
}: {
  name: string;
  image: string;
  href: string;
  ratio?: string;
}) {
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        paddingBottom: ratio,
        overflow: "hidden",
        textDecoration: "none",
        background: "#111",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 42%)", zIndex: 1 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 16px 36px", textAlign: "center", color: "#fff", zIndex: 2 }}>
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(18px, 2.3vw, 28px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: FUTURA,
          }}
        >
          {name}
        </h2>
        <span style={{ fontSize: 13, fontFamily: FUTURA, fontWeight: 400, letterSpacing: "0.06em" }}>
          Discover {name} ›
        </span>
      </div>
    </Link>
  );
}

function DualTile({
  name,
  image,
  href,
  cta,
  watermark,
  ratio = "78%",
}: {
  name: string;
  image: string;
  href: string;
  cta: string;
  watermark?: string;
  ratio?: string;
}) {
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        paddingBottom: ratio,
        overflow: "hidden",
        textDecoration: "none",
        background: "#1a1a1a",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {watermark ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(80px, 14vw, 160px)",
            fontWeight: 700,
            color: "rgba(0,0,0,0.18)",
            fontFamily: FUTURA,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {watermark}
        </span>
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)", zIndex: 2 }} />
      {/* Kenzo: judul + CTA di tengah tile, bukan nempel bawah */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          zIndex: 3,
          padding: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(20px, 2.5vw, 30px)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: FUTURA,
          }}
        >
          {name}
        </h2>
        <span style={{ fontSize: 13, fontFamily: FUTURA }}>{cta}</span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const { products: allProducts, settings } = await getPublicCatalog();
  const company = settings.company;
  const products = allProducts.filter((p) => p.active);
  const empty = products.length === 0;
  const isUsablePhoto = (src?: string) =>
    !!src && !src.endsWith(".svg") && !src.includes("placeholder");

  const heroFromCms = ((company as any).heroImages as string[] | undefined)?.filter(isUsablePhoto);
  const heroSlides =
    heroFromCms && heroFromCms.length
      ? heroFromCms
      : isUsablePhoto((company as any).heroImage)
        ? [(company as any).heroImage as string]
        : [MEDIA.hero];

  const lookbook = empty
    ? MEDIA.products
    : products.map((p, i) => {
        const photo = getProductPhotoList(p)[0] || p.photo || "";
        return {
          id: p.id,
          name: p.name,
          photo: isUsablePhoto(photo) ? photo : MEDIA.products[i % MEDIA.products.length].photo,
          slug: toSlug(p.name),
          line: "Henima",
          subtitle: `${p.name} ${p.isGiftSet ? "Gift Set" : "Extrait de Parfum"}`,
        };
      });

  /* Curated chapter tiles — keep lifestyle art + chapter names; link to matching product if any */
  const discover = MEDIA.discover.map((d) => {
    const match = products.find((p) => p.name.toLowerCase() === d.name.toLowerCase());
    return {
      name: d.name,
      image: d.image,
      href: match ? `/shop/${toSlug(match.name)}` : d.href,
    };
  });

  return (
    <div style={{ background: "#FFFFFF", color: "#111" }}>
      {/* 1. HERO — full-bleed visual only (Kenzo cinematic slide: no center copy) */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          background: "#0a1620",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroCarousel images={heroSlides} heroVideo={(company as any).heroVideo} productName={products[0]?.name || company.name} />
        </div>
        {/* subtle top vignette only — Kenzo: no grey header bar */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 18%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </section>

      {/* 2. BEST-SELLERS */}
      <ProductLookbookRail title="Our best-sellers" products={lookbook} />

      {/* 3. DISCOVER 2×2 — desktop inset; mobile full-bleed like Kenzo */}
      <section style={{ background: "#fff", padding: "40px 0 0" }}>
        <div
          className="kz-shell kz-shell--bleed-mobile"
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }} className="kz-grid">
            {discover.map((d) => (
              <DiscoverTile key={d.name} name={d.name} image={d.image} href={d.href} ratio="100%" />
            ))}
          </div>
        </div>
      </section>

      {/* white breath — Kenzo punya jarak besar antar blok */}
      <div style={{ height: 72, background: "#fff" }} aria-hidden />

      {/* 4. FOR A MORE BEAUTIFUL WORLD — full photo band */}
      <section style={{ position: "relative", width: "100%", minHeight: "52vw", maxHeight: 680 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MEDIA.universe} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "52vw",
            maxHeight: 680,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "64px 24px",
            color: "#fff",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(22px, 3.5vw, 36px)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "var(--font-jakarta)",
            }}
          >
            For a more beautiful world
          </h2>
          <Link href="/our-story" style={{ color: "#fff", fontSize: 13, textDecoration: "none" }}>
            The world by Henima ›
          </Link>
        </div>
      </section>

      {/* white breath sebelum Our Stores */}
      <div style={{ height: 72, background: "#fff" }} aria-hidden />

      {/* 5. OUR STORES | HAPPENINGS — desktop inset; mobile full-bleed */}
      <section id="henima-stores" style={{ background: "#fff", padding: 0 }}>
        <div
          className="kz-shell kz-shell--bleed-mobile"
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }} className="kz-grid">
            <DualTile name="Our Stores" image={MEDIA.stores} href="/faq" cta="Find our points of sale ›" watermark="H" ratio="72%" />
            <DualTile name="Henima Happenings" image={MEDIA.happenings} href="/blog" cta="Find out more ›" ratio="72%" />
          </div>
        </div>
      </section>

      {/* Create a connection — jarak atas & bawah, tidak nyatu/ketiban footer */}
      {!user && <NewsletterBlock />}

      <style>{`
        @media (max-width: 767px) {
          /* HP: full lebar; rongga putih tipis hanya antar tile (atas–bawah) */
          .kz-grid { grid-template-columns: 1fr !important; gap: 1px !important; }
          .kz-shell--bleed-mobile {
            max-width: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
