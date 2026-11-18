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

/** Kenzo best-sellers shell */
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
          margin-bottom: 32px;
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

        .kz-rail-wrap { position: relative; }
        .kz-rail {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .kz-rail::-webkit-scrollbar { display: none; }

        /* Kenzo card: square media → title → subtitle → outline CTA */
        .kz-rail-card {
          flex: 0 0 calc((100% - 60px) / 4);
          max-width: calc((100% - 60px) / 4);
          scroll-snap-align: start;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .kz-rail-link {
          text-decoration: none;
          color: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .kz-rail-media {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #F5F5F5;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .kz-rail-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          padding: 6%;
          box-sizing: border-box;
          transition: transform 0.45s ease;
        }
        .kz-rail-card:hover .kz-rail-img { transform: scale(1.02); }

        .kz-rail-line {
          margin: 0 0 8px;
          padding: 0 4px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: ${FUTURA};
          line-height: 1.3;
          color: #111;
          text-align: center;
        }
        .kz-rail-sub {
          margin: 0 0 20px;
          padding: 0 8px;
          font-size: 12px;
          font-weight: 400;
          color: #222;
          line-height: 1.45;
          letter-spacing: 0.02em;
          font-family: ${FUTURA};
          text-align: center;
          text-transform: none;
        }

        /* Exact Kenzo .btn.purchase-button Store Locator */
        .kz-rail-cta {
          display: block;
          box-sizing: border-box;
          width: 150px;
          height: 40px;
          margin: auto auto 0;
          padding: 6px 12px;
          border: 0.5px solid rgba(33, 33, 33, 0.7);
          border-radius: 1px;
          background: #fff;
          color: rgb(68, 68, 68);
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: normal;
          text-align: center;
          text-transform: none;
          text-decoration: none;
          font-family: ${FUTURA};
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .kz-rail-cta:hover {
          background: rgb(33, 33, 33);
          border-color: rgb(33, 33, 33);
          color: #fff;
        }

        .kz-arrow {
          position: absolute;
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
          .kz-bestsellers { padding: 40px 0 48px !important; }
          .kz-bestsellers > div { padding: 0 16px !important; }
          .kz-bestsellers-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 24px;
          }
          .kz-bestsellers-title { font-size: 20px !important; }
          .kz-bestsellers-all {
            display: inline-block !important;
            font-size: 13px !important;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .kz-rail { gap: 16px !important; }
          .kz-rail-card {
            flex: 0 0 min(300px, 80vw) !important;
            max-width: min(300px, 80vw) !important;
            width: min(300px, 80vw) !important;
          }
          .kz-rail-media { margin-bottom: 18px !important; }
          .kz-rail-line { font-size: 12px !important; margin-bottom: 8px !important; }
          .kz-rail-sub { font-size: 12px !important; margin-bottom: 18px !important; }
          .kz-rail-cta {
            width: 150px !important;
            height: 40px !important;
            padding: 6px 12px !important;
            font-size: 16px !important;
          }
          .kz-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
