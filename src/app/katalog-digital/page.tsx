import Image from "next/image";
import { getDatabase } from "@/lib/db";
import CatalogProductSection from "@/components/CatalogProductSection";

export const dynamic = "force-dynamic";

function resolveHeroImage(
  catalog: { images?: string[]; heroImage?: string } | undefined,
  companyHero: string | undefined
): string | null {
  if (catalog?.heroImage) return catalog.heroImage;
  if (catalog?.images?.length) return catalog.images[0];
  if (companyHero) return companyHero;
  return null;
}

export default async function KatalogDigitalPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const catalog = db.settings.catalog;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";
  const productPhotos = products.map((p) => p.photo).filter(Boolean);
  const heroImage = resolveHeroImage(catalog, company.heroImage);

  return (
    <div className="catalog-page">
      {/* HERO — full-bleed image + white text panel (HMNS style) */}
      <header className="catalog-hero">
        <div className="catalog-hero-media">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Henima fragrance collection"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          ) : productPhotos.length > 1 ? (
            <div className="catalog-hero-collage">
              {productPhotos.slice(0, 4).map((photo, i) => (
                <div key={photo + i} className="catalog-hero-collage-item">
                  <Image
                    src={photo}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="50vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="catalog-hero-image-placeholder">
              <span>Upload foto koleksi di Admin → Katalog Digital</span>
            </div>
          )}
        </div>

        <div className="catalog-hero-panel">
          <p className="catalog-hero-eyebrow">Henima</p>
          <h1 className="catalog-hero-title">
            Catalog of
            <br />
            Henima
          </h1>
        </div>

        {catalog?.pdfUrl ? (
          <a
            href={catalog.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="catalog-hero-download"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Catalog
          </a>
        ) : null}
      </header>

      {/* PRODUCTS */}
      <main className="catalog-products">
        {products.map((product) => (
          <CatalogProductSection key={product.id} product={product} />
        ))}
      </main>

      {/* FOOTER CTA */}
      <footer className="catalog-cta">
        <div>
          <h3 className="catalog-cta-title">Tertarik dengan koleksi kami?</h3>
          <p className="catalog-cta-subtitle">
            Hubungi kami langsung via WhatsApp untuk pemesanan.
          </p>
        </div>
        <a
          href={"https://wa.me/" + waNumber}
          target="_blank"
          rel="noreferrer"
          className="catalog-cta-btn"
        >
          Order via WhatsApp
        </a>
      </footer>

      <style>{`
        .catalog-page {
          background: #ffffff;
          min-height: 100vh;
          color: #1C1917;
          font-family: var(--font-jost);
          overflow-x: hidden;
        }

        /* ── Hero (full-bleed HMNS style) ── */
        .catalog-hero {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          min-height: max(72vh, 520px);
          overflow: hidden;
          border-bottom: 2px solid #1C1917;
        }
        .catalog-hero-media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .catalog-hero-panel {
          position: relative;
          z-index: 1;
          background: #ffffff;
          width: clamp(300px, 42vw, 520px);
          height: 100%;
          min-height: inherit;
          padding: 80px clamp(32px, 6vw, 96px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .catalog-hero-eyebrow {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #1C1917;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .catalog-hero-title {
          font-family: var(--font-jost);
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 700;
          color: #1C1917;
          line-height: 0.95;
          letter-spacing: -2px;
        }
        .catalog-hero-download {
          position: absolute;
          right: 32px;
          bottom: 32px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #1C1917;
          padding: 12px 20px;
          font-size: 12px;
          letter-spacing: 0.5px;
          text-decoration: none;
          font-weight: 500;
          border-radius: 999px;
          box-shadow: 0 2px 12px rgba(28, 25, 23, 0.12);
        }
        .catalog-hero-download:hover {
          background: #FAFAFA;
        }
        .catalog-hero-collage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          height: 100%;
          gap: 2px;
        }
        .catalog-hero-collage-item {
          position: relative;
          min-height: 200px;
        }
        .catalog-hero-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #F0F0F0;
          color: #9A8F82;
          font-size: 13px;
          letter-spacing: 1px;
          text-align: center;
          padding: 24px;
        }

        /* ── Products list ── */
        .catalog-products {
          display: flex;
          flex-direction: column;
        }

        /* ── Product section (shared with component) ── */
        .catalog-product-section {
          padding: 100px 8vw;
          border-bottom: 1px solid rgba(28, 25, 23, 0.1);
        }
        .catalog-product-header {
          margin-bottom: 40px;
        }
        .catalog-product-name {
          font-family: var(--font-jost);
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          color: #1C1917;
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }
        .catalog-product-info {
          font-size: 13px;
          color: #6B6560;
          margin-bottom: 8px;
        }
        .catalog-product-info strong {
          font-weight: 700;
          color: #1C1917;
        }
        .catalog-product-price {
          font-size: 15px;
          font-weight: 600;
          color: #1C1917;
        }
        .catalog-product-coming-soon {
          font-size: 13px;
          color: #9A8F82;
        }
        .catalog-product-body {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 48px;
          align-items: start;
        }
        .catalog-product-photo {
          position: relative;
          aspect-ratio: 4 / 5;
          background: #F5F5F5;
          overflow: hidden;
        }
        .catalog-product-photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F0F0F0;
          color: #ccc;
          font-size: 14px;
        }
        .catalog-product-story {
          font-size: 15px;
          color: #4A4440;
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 28px;
          max-width: 52ch;
        }
        .catalog-notes {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .catalog-note-label {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 4px;
        }
        .catalog-note-value {
          font-size: 14px;
          color: #6B6560;
          font-weight: 300;
          line-height: 1.6;
        }
        .catalog-product-footer {
          border-top: 1px solid rgba(28, 25, 23, 0.1);
          margin-top: 40px;
          padding-top: 24px;
        }
        .catalog-performance {
          font-size: 13px;
          color: #1C1917;
          line-height: 1.8;
        }
        .catalog-performance-label {
          font-weight: 700;
        }
        .catalog-performance-sep {
          font-weight: 400;
          color: #6B6560;
        }

        /* ── Footer CTA ── */
        .catalog-cta {
          background: #1C1917;
          padding: 80px 8vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .catalog-cta-title {
          font-family: var(--font-jost);
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        .catalog-cta-subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
        }
        .catalog-cta-btn {
          display: inline-block;
          background: transparent;
          color: #fff;
          padding: 14px 36px;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .catalog-hero {
            min-height: auto;
            display: flex;
            flex-direction: column;
          }
          .catalog-hero-media {
            position: relative;
            min-height: 50vw;
            order: 1;
          }
          .catalog-hero-panel {
            width: 100%;
            padding: 48px 6vw 56px;
            order: 2;
          }
          .catalog-hero-download {
            right: 16px;
            bottom: 16px;
          }
          .catalog-product-section {
            padding: 80px 6vw;
          }
          .catalog-product-body {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}
