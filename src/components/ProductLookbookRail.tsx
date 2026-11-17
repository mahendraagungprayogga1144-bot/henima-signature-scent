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

const FUTURA =
  "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";

/** Kenzo best-sellers shell — wide enough for 4 square tiles */
const SHELL = {
  maxWidth: 1360,
  margin: "0 auto",
  width: "100%",
  padding: "0 48px",
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

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".kz-rail-card") as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="kz-bestsellers" style={{ background: "#FFFFFF", padding: "72px 0 64px" }}>
      <div style={SHELL}>
        {/* Kenzo: title left · All products right, same row */}
        <div className="kz-bestsellers-head">
          <h2 className="kz-bestsellers-title">{title}</h2>
          <Link href={hrefAll} className="kz-bestsellers-all">
            All products
          </Link>
        </div>

        <div className="kz-rail-wrap">
          <div ref={trackRef} className="kz-rail">
            {products.map((p) => (
              <article key={p.id} className="kz-rail-card">
                <Link href={`/shop/${p.slug}`} className="kz-rail-link">
                  <div className="kz-rail-media">
                    {p.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo} alt={p.name} className="kz-rail-img" />
                    ) : null}
                    <span className="kz-rail-hover" aria-hidden>
                      Discover
                    </span>
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

          <button type="button" aria-label="Previous" onClick={() => scrollBy(-1)} className="kz-arrow kz-arrow--prev">
            ‹
          </button>
          <button type="button" aria-label="Next" onClick={() => scrollBy(1)} className="kz-arrow kz-arrow--next">
            ›
          </button>
        </div>
      </div>

      <style>{`
        .kz-bestsellers-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }
        .kz-bestsellers-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          color: #D6001C;
          font-family: ${FUTURA};
        }
        .kz-bestsellers-all {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.2;
          color: #111;
          text-decoration: none;
          font-family: ${FUTURA};
          white-space: nowrap;
        }
        .kz-bestsellers-all:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .kz-rail-wrap {
          position: relative;
        }
        .kz-rail {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .kz-rail::-webkit-scrollbar { display: none; }

        /* ~4 tiles visible on desktop (Kenzo) */
        .kz-rail-card {
          flex: 0 0 calc((100% - 60px) / 4);
          max-width: calc((100% - 60px) / 4);
          scroll-snap-align: start;
          text-align: center;
        }
        .kz-rail-link {
          text-decoration: none;
          color: #000;
          display: block;
        }
        .kz-rail-media {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #F3F3F3;
          margin-bottom: 18px;
          overflow: hidden;
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
        .kz-rail-hover {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.38);
          color: #fff;
          font-family: ${FUTURA};
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .kz-rail-card:hover .kz-rail-hover { opacity: 1; }
        .kz-rail-card:hover .kz-rail-img { transform: scale(1.03); }

        .kz-rail-line {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: ${FUTURA};
          line-height: 1.25;
          color: #111;
          text-align: center;
        }
        .kz-rail-sub {
          margin: 0 0 16px;
          font-size: 12px;
          font-weight: 400;
          color: #444;
          line-height: 1.4;
          min-height: 34px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: ${FUTURA};
          text-align: center;
        }
        .kz-rail-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          width: 100%;
          border: 1px solid #111;
          background: #fff;
          color: #111;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          font-family: ${FUTURA};
          transition: background 0.2s ease, color 0.2s ease;
        }
        .kz-rail-cta:hover {
          background: #111;
          color: #fff;
        }

        .kz-arrow {
          position: absolute;
          /* vertically center on the square image */
          top: 22%;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.14);
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          z-index: 3;
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kz-arrow--prev { left: -18px; }
        .kz-arrow--next { right: -18px; }
        .kz-arrow:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

        @media (max-width: 1100px) {
          .kz-rail-card {
            flex: 0 0 calc((100% - 40px) / 3);
            max-width: calc((100% - 40px) / 3);
          }
          .kz-bestsellers > div { padding: 0 28px !important; }
          .kz-arrow--prev { left: -8px; }
          .kz-arrow--next { right: -8px; }
        }
        @media (max-width: 767px) {
          .kz-bestsellers { padding: 48px 0 56px !important; }
          .kz-bestsellers > div { padding: 0 16px !important; }
          .kz-bestsellers-head { margin-bottom: 20px; }
          .kz-bestsellers-title { font-size: 18px !important; }
          .kz-bestsellers-all { font-size: 12px !important; }
          .kz-rail { gap: 14px !important; }
          .kz-rail-card {
            flex: 0 0 min(291px, 78vw) !important;
            max-width: min(291px, 78vw) !important;
            width: min(291px, 78vw) !important;
          }
          .kz-rail-media { margin-bottom: 14px !important; }
          .kz-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
