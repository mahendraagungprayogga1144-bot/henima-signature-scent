"use client";
import Link from "next/link";
import { useRef } from "react";

export type LookbookProduct = {
  id: string;
  name: string;
  photo: string;
  slug: string;
  line?: string;
  subtitle?: string;
};

/** Kenzo best-sellers: centered column, not full-bleed */
const SHELL = {
  maxWidth: 1120,
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
  boxSizing: "border-box" as const,
};

export default function ProductLookbookRail({
  title = "Our best-sellers",
  products,
  hrefAll = "/shop",
  ctaLabel = "Discover",
}: {
  title?: string;
  products: LookbookProduct[];
  hrefAll?: string;
  ctaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (!products.length) return null;

  return (
    <section className="kz-bestsellers" style={{ background: "#FFFFFF", padding: "64px 0 56px" }}>
      <div style={SHELL}>
        <div className="kz-bestsellers-head">
          <h2 className="kz-bestsellers-title">{title}</h2>
          <Link href={hrefAll} className="kz-bestsellers-all">
            All products
          </Link>
        </div>

        <div style={{ position: "relative" }}>
          <div
            ref={trackRef}
            className="kz-rail"
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 8,
              scrollbarWidth: "none",
            }}
          >
            {products.map((p) => (
              <article key={p.id} className="kz-rail-card">
                <Link href={`/shop/${p.slug}`} style={{ textDecoration: "none", color: "#000", display: "block" }}>
                  <div className="kz-rail-media">
                    {p.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo} alt={p.name} className="kz-rail-img" />
                    ) : null}
                  </div>
                  <h3 className="kz-rail-line">{p.line || "Henima"}</h3>
                  <p className="kz-rail-sub">{p.subtitle || p.name}</p>
                </Link>
                <Link href={`/shop/${p.slug}`} className="kz-rail-cta">
                  {ctaLabel}
                </Link>
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => trackRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
            className="kz-arrow"
            style={{ top: 100 }}
          >
            ›
          </button>
        </div>
      </div>

      <style>{`
        .kz-bestsellers-head {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 22px;
        }
        .kz-bestsellers-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          line-height: 27px;
          color: #D6001C;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
        }
        .kz-bestsellers-all {
          font-size: 12px;
          font-weight: 700;
          line-height: 15.72px;
          color: #444444;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
        }
        .kz-rail::-webkit-scrollbar { display: none; }
        .kz-rail-card {
          flex: 0 0 220px;
          width: 220px;
          scroll-snap-align: start;
        }
        .kz-rail-media {
          width: 100%;
          aspect-ratio: 4 / 5;
          background: #F2F2F2;
          margin-bottom: 14px;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }
        .kz-rail-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.45s ease;
        }
        .kz-rail-card:hover .kz-rail-img {
          transform: scale(1.04);
        }
        .kz-rail-line {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
          line-height: 1.3;
          color: #000;
        }
        .kz-rail-sub {
          margin: 0 0 12px;
          font-size: 11px;
          font-weight: 400;
          color: #111;
          line-height: 1.35;
          min-height: 32px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
        }
        .kz-rail-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          width: 100%;
          border: 1px solid #000;
          background: #fff;
          color: #000;
          font-size: 11px;
          text-decoration: none;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
        }
        .kz-arrow {
          position: absolute;
          right: -8px;
          top: 72px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #fff;
          box-shadow: 0 1px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          font-size: 20px;
          z-index: 2;
        }
        @media (max-width: 767px) {
          .kz-bestsellers { padding: 40px 0 48px !important; }
          .kz-bestsellers > div { padding: 0 15px !important; }
          .kz-bestsellers-head {
            margin-bottom: 16px;
          }
          /* Kenzo mobile: Our best-sellers 18/700/#D6001C */
          .kz-bestsellers-title {
            font-size: 18px !important;
            font-weight: 700 !important;
            line-height: 27px !important;
            color: #D6001C !important;
            margin: 0 0 8px !important;
          }
          /* Kenzo mobile: All products 12/700/#444 underline */
          .kz-bestsellers-all {
            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 15.72px !important;
            color: #444444 !important;
            text-decoration: underline !important;
          }
          .kz-rail { gap: 12px !important; }
          .kz-rail-card {
            flex: 0 0 min(260px, 72vw) !important;
            width: min(260px, 72vw) !important;
          }
          .kz-rail-media {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 4 / 5 !important;
            margin-bottom: 12px !important;
          }
          .kz-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
