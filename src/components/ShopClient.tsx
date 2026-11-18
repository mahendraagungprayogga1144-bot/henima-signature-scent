"use client";
import WishlistButton from "@/components/WishlistButton";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  active: boolean;
  originalPrice: number;
  discountPrice: number;
  variants: { id: string; sizeMl: number; active: boolean; originalPrice: number; discountPrice: number }[];
  comingSoon?: boolean;
  isGiftSet?: boolean;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function productPrice(p: Product) {
  const variants = p.variants.filter((v) => v.active);
  if (variants.length > 0) {
    const prices = variants.map((v) => v.discountPrice || v.originalPrice).filter((n) => n > 0);
    if (prices.length) return Math.min(...prices);
  }
  return p.discountPrice || p.originalPrice || 0;
}

/** Kenzo subtitle — sentence case like "Eau de toilette" */
function productVariantLabel(p: Product) {
  if (p.isGiftSet) return "Gift set";
  const sizes = p.variants.filter((v) => v.active).map((v) => v.sizeMl).sort((a, b) => a - b);
  const conc = "Extrait de Parfum";
  if (sizes.length === 1) return `${conc} ${sizes[0]} ml`;
  if (sizes.length > 1) return `${conc} · from ${sizes[0]} ml`;
  return conc;
}

/** Kenzo filter bar — rgb(163, 1, 22) */
const KENZO_RED = "#A30116";

const FILTER_TABS = [
  { key: "category", label: "Category" },
  { key: "line", label: "Line" },
  { key: "volume", label: "Volume" },
  { key: "concentration", label: "Concentration" },
  { key: "notes", label: "Olfactory notes" },
  { key: "mood", label: "Mood" },
] as const;

export default function ShopClient({ products }: { products: Product[]; waNumber: string }) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [selectedAvail, setSelectedAvail] = useState<string[]>([]);

  const allSizes = useMemo(
    () =>
      Array.from(
        new Set(products.flatMap((p) => p.variants.filter((v) => v.active).map((v) => v.sizeMl)))
      ).sort((a, b) => a - b),
    [products]
  );

  const allLines = useMemo(() => Array.from(new Set(products.map((p) => p.name))).sort(), [products]);

  const filtered = products.filter((p) => {
    const variants = p.variants.filter((v) => v.active);
    if (selectedSizes.length > 0 && !variants.some((v) => selectedSizes.includes(v.sizeMl))) return false;
    if (selectedLines.length > 0 && !selectedLines.includes(p.name)) return false;
    if (selectedAvail.length > 0) {
      const isComingSoon = !!p.comingSoon;
      if (selectedAvail.includes("Available Now") && isComingSoon) return false;
      if (selectedAvail.includes("Coming Soon") && !isComingSoon) return false;
    }
    return true;
  });

  const toggleSize = (s: number) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleLine = (n: string) =>
    setSelectedLines((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  const toggleAvail = (a: string) =>
    setSelectedAvail((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const clearAll = () => {
    setSelectedSizes([]);
    setSelectedLines([]);
    setSelectedAvail([]);
  };

  const activeCount = selectedSizes.length + selectedLines.length + selectedAvail.length;

  /** Layout test only — shown when Supabase has no products */
  const testProducts: Product[] = [
    { id: "test-1", name: "Afternoon", description: "", photo: "/layout/product-1.jpg", active: true, originalPrice: 450000, discountPrice: 450000, variants: [{ id: "t1v", sizeMl: 50, active: true, originalPrice: 450000, discountPrice: 450000 }] },
    { id: "test-2", name: "The Distance", description: "", photo: "/layout/product-2.jpg", active: true, originalPrice: 450000, discountPrice: 450000, variants: [{ id: "t2v", sizeMl: 50, active: true, originalPrice: 450000, discountPrice: 450000 }] },
    { id: "test-3", name: "Signature", description: "", photo: "/layout/product-3.jpg", active: true, originalPrice: 480000, discountPrice: 480000, variants: [{ id: "t3v", sizeMl: 50, active: true, originalPrice: 480000, discountPrice: 480000 }] },
    { id: "test-4", name: "Intimate", description: "", photo: "/layout/product-4.jpg", active: true, originalPrice: 450000, discountPrice: 450000, variants: [{ id: "t4v", sizeMl: 30, active: true, originalPrice: 450000, discountPrice: 450000 }] },
    { id: "test-5", name: "Beloved", description: "", photo: "/layout/product-5.jpg", active: true, originalPrice: 520000, discountPrice: 520000, variants: [{ id: "t5v", sizeMl: 50, active: true, originalPrice: 520000, discountPrice: 520000 }] },
    { id: "test-6", name: "Discovery", description: "", photo: "/layout/discover-1.jpg", active: true, originalPrice: 350000, discountPrice: 350000, variants: [{ id: "t6v", sizeMl: 10, active: true, originalPrice: 350000, discountPrice: 350000 }], isGiftSet: true },
    { id: "test-7", name: "Afternoon", description: "", photo: "/layout/chapter-afternoon.jpg", active: true, originalPrice: 450000, discountPrice: 450000, variants: [{ id: "t7v", sizeMl: 100, active: true, originalPrice: 650000, discountPrice: 650000 }] },
    { id: "test-8", name: "The Distance", description: "", photo: "/layout/chapter-distance.jpg", active: true, originalPrice: 450000, discountPrice: 450000, variants: [{ id: "t8v", sizeMl: 100, active: true, originalPrice: 650000, discountPrice: 650000 }] },
  ];

  const displayList =
    products.length > 0
      ? filtered
      : testProducts.filter((p) => {
          const variants = p.variants.filter((v) => v.active);
          if (selectedSizes.length > 0 && !variants.some((v) => selectedSizes.includes(v.sizeMl))) return false;
          if (selectedLines.length > 0 && !selectedLines.includes(p.name)) return false;
          if (selectedAvail.length > 0) {
            const isComingSoon = !!p.comingSoon;
            if (selectedAvail.includes("Available Now") && isComingSoon) return false;
            if (selectedAvail.includes("Coming Soon") && !isComingSoon) return false;
          }
          return true;
        });

  const sizesForFilter =
    products.length > 0
      ? allSizes
      : Array.from(new Set(testProducts.flatMap((p) => p.variants.map((v) => v.sizeMl)))).sort((a, b) => a - b);
  const linesForFilter =
    products.length > 0 ? allLines : Array.from(new Set(testProducts.map((p) => p.name))).sort();

  function panelContent(key: string) {
    if (key === "volume") {
      if (sizesForFilter.length === 0) return <p style={emptyHint}>No sizes yet</p>;
      return sizesForFilter.map((size) => (
        <button key={size} type="button" onClick={() => toggleSize(size)} style={optBtn(selectedSizes.includes(size))}>
          {size} ml
        </button>
      ));
    }
    if (key === "line") {
      if (linesForFilter.length === 0) return <p style={emptyHint}>No lines yet</p>;
      return linesForFilter.map((name) => (
        <button key={name} type="button" onClick={() => toggleLine(name)} style={optBtn(selectedLines.includes(name))}>
          {name}
        </button>
      ));
    }
    if (key === "category") {
      return ["Available Now", "Coming Soon"].map((s) => (
        <button key={s} type="button" onClick={() => toggleAvail(s)} style={optBtn(selectedAvail.includes(s))}>
          {s}
        </button>
      ));
    }
    return <p style={emptyHint}>Coming soon</p>;
  }

  function FilterChevron({ open }: { open: boolean }) {
    return (
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden
        style={{
          flexShrink: 0,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.18s ease",
        }}
      >
        <path d="M1 1l4 4 4-4" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <div
      className="shop-catalog"
      style={{
        background: "#FFFFFF",
        minHeight: "100vh",
        color: "#212529",
        fontFamily: "var(--font-futura-catalog), FuturaBT-Medium, Futura, sans-serif",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: "24px",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      {/* Desktop: Kenzo red filter bar — full-bleed, inner 1140 */}
      <div
        className="shop-red-bar shop-red-bar--desktop"
        style={{
          background: KENZO_RED,
          width: "100%",
          height: 74,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 20,
        }}
      >
        <ul
          className="shop-red-filters"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            width: "100%",
            maxWidth: 1140,
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 0,
            boxSizing: "border-box",
          }}
        >
          {FILTER_TABS.map((tab) => {
            const open = openFilter === tab.key;
            return (
              <li
                key={tab.key}
                className="shop-red-item"
                style={{
                  position: "relative",
                  flex: "1 1 0",
                  minWidth: 0,
                  height: 69,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  boxSizing: "border-box",
                  background: KENZO_RED,
                }}
              >
                <button
                  type="button"
                  className="shop-red-tab"
                  onClick={() => setOpenFilter(open ? null : tab.key)}
                  aria-expanded={open}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    width: "100%",
                    appearance: "none",
                    WebkitAppearance: "none",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.5)",
                    margin: 0,
                    padding: "6px 0",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "24px",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tab.label}
                  </span>
                  <FilterChevron open={open} />
                </button>
                {open && (
                  <div
                    style={{
                      position: "absolute",
                      left: 20,
                      right: 20,
                      top: "100%",
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                      padding: 16,
                      zIndex: 30,
                      minWidth: 180,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{panelContent(tab.key)}</div>
                    {activeCount > 0 && (
                      <button type="button" onClick={clearAll} style={clearBtn}>
                        Clear ({activeCount})
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile only: Kenzo full-bleed maroon Filter bar + centered results */}
      <div className="shop-mobile-filter-wrap" style={{ display: "none" }}>
        <button
          type="button"
          className="shop-mobile-filter-bar"
          onClick={() => {
            setMobileFiltersOpen((v) => !v);
            setOpenFilter(null);
          }}
          aria-expanded={mobileFiltersOpen}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            width: "100%",
            margin: 0,
            padding: "14px 20px",
            boxSizing: "border-box",
            background: KENZO_RED,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            position: "relative",
            zIndex: 20,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 5h18l-7 8.5V19l-4 2v-7.5L3 5z"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Filter{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        {mobileFiltersOpen && (
          <div
            className="shop-mobile-filter-panel"
            style={{
              background: KENZO_RED,
              padding: "0 12px 16px",
              position: "relative",
              zIndex: 20,
            }}
          >
            {FILTER_TABS.map((tab) => {
              const open = openFilter === tab.key;
              return (
                <div key={tab.key} style={{ borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
                  <button
                    type="button"
                    onClick={() => setOpenFilter(open ? null : tab.key)}
                    aria-expanded={open}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      appearance: "none",
                      WebkitAppearance: "none",
                      background: "transparent",
                      border: "none",
                      padding: "12px 8px",
                      color: "#FFFFFF",
                      fontFamily: "inherit",
                      fontSize: 16,
                      fontWeight: 400,
                      lineHeight: "24px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {tab.label}
                    <FilterChevron open={open} />
                  </button>
                  {open && (
                    <div style={{ background: "#FFFFFF", padding: 16, marginBottom: 8 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{panelContent(tab.key)}</div>
                      {activeCount > 0 && (
                        <button type="button" onClick={clearAll} style={clearBtn}>
                          Clear ({activeCount})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p
          className="shop-mobile-results"
          style={{
            margin: 0,
            padding: "18px 16px 6px",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#666666",
            fontFamily: "inherit",
          }}
        >
          {displayList.length} Results
        </p>
      </div>

      {/* Results + 4-col grid — Kenzo PLP: portrait tiles, fixed card width, generous gaps */}
      <div
        className="shop-catalog-inner"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 40px 120px", boxSizing: "border-box" }}
      >
        <h1
          className="shop-results-desktop"
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#666666",
            margin: "0 0 20px",
            padding: 0,
          }}
        >
          {displayList.length} Results
        </h1>

        {displayList.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "#666666",
              fontSize: 16,
              lineHeight: "24px",
              margin: 0,
            }}
          >
            Tidak ada produk yang cocok.
          </p>
        ) : (
          <div
            className="shop-kenzo-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              columnGap: 28,
              rowGap: 36,
              marginTop: 0,
              justifyContent: "start",
            }}
          >
            {displayList.map((product) => {
              const price = productPrice(product);
              const href = "/shop/" + toSlug(product.name);
              return (
                <article
                  key={product.id}
                  className="shop-product"
                  style={{ display: "flex", flexDirection: "column", textAlign: "center", margin: 0, maxWidth: "100%" }}
                >
                  <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    {/* Portrait frame like Kenzo (~4:5) — cover so mixed assets fill evenly */}
                    <div
                      className="shop-prod-frame"
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4 / 5",
                        background: "#F2F2F2",
                        overflow: "hidden",
                        margin: 0,
                      }}
                    >
                      <span className="shop-wish">
                        <WishlistButton productId={product.id} />
                      </span>
                      {product.photo ? (
                        product.photo.startsWith("/") ? (
                          <Image
                            src={product.photo}
                            alt={product.name}
                            fill
                            sizes="(max-width:767px) 50vw, (max-width:1024px) 33vw, 280px"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                            }}
                            className="shop-prod-img"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.photo}
                            alt={product.name}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                            }}
                            className="shop-prod-img"
                          />
                        )
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#BCBCBC",
                            fontSize: 14,
                          }}
                        >
                          Henima
                        </div>
                      )}
                      {product.comingSoon && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            background: "#212121",
                            color: "#fff",
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "4px 8px",
                            zIndex: 2,
                          }}
                        >
                          Coming Soon
                        </div>
                      )}
                    </div>

                    {/* Kenzo tile-body: name + variant, centered */}
                    <div style={{ padding: "14px 8px 8px", textAlign: "center" }}>
                      <h2
                        style={{
                          fontFamily: "inherit",
                          fontSize: 18,
                          fontWeight: 600,
                          lineHeight: "22px",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          color: "#212121",
                          margin: "0 0 8px",
                          padding: 0,
                        }}
                      >
                        {product.name}
                      </h2>

                      <p
                        style={{
                          fontFamily: "inherit",
                          fontSize: 13,
                          fontWeight: 400,
                          lineHeight: "18px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          color: "#9A9A9A",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {productVariantLabel(product)}
                        {product.comingSoon ? " · Coming soon" : ""}
                      </p>

                      {price > 0 && !product.comingSoon && (
                        <p
                          style={{
                            fontFamily: "inherit",
                            fontSize: 13,
                            fontWeight: 500,
                            lineHeight: "20px",
                            textAlign: "center",
                            color: "#212121",
                            margin: "10px 0 0",
                            padding: 0,
                          }}
                        >
                          {formatRp(price)}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {(openFilter || mobileFiltersOpen) && (
        <div
          aria-hidden
          onClick={() => {
            setOpenFilter(null);
            setMobileFiltersOpen(false);
          }}
          style={{ position: "fixed", inset: 0, zIndex: 15 }}
        />
      )}

      <style>{`
        .shop-catalog *, .shop-catalog *::before, .shop-catalog *::after { box-sizing: border-box; }
        .shop-kenzo-grid a:hover .shop-prod-img { transform: scale(1.04); }
        .shop-wish button {
          width: 28px !important;
          height: 28px !important;
          background: transparent !important;
          border: none !important;
          backdrop-filter: none !important;
          box-shadow: none !important;
          top: 10px !important;
          right: 8px !important;
          opacity: 0.85;
        }
        .shop-wish button svg { width: 18px; height: 18px; }
        .shop-product:hover .shop-wish button { opacity: 1; }
        .shop-red-tab:focus { outline: none; }
        .shop-red-tab:focus-visible { border-bottom-color: #fff !important; }
        @media (max-width: 1100px) {
          .shop-kenzo-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            column-gap: 22px !important;
            row-gap: 28px !important;
          }
          .shop-catalog-inner { padding: 24px 28px 96px !important; }
        }
        @media (max-width: 767px) {
          .shop-red-bar--desktop { display: none !important; }
          .shop-mobile-filter-wrap { display: block !important; }
          .shop-results-desktop { display: none !important; }
          .shop-kenzo-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            column-gap: 12px !important;
            row-gap: 24px !important;
          }
          .shop-catalog-inner { padding: 8px 16px 72px !important; }
          .shop-product h2 { font-size: 14px !important; line-height: 18px !important; letter-spacing: 0.03em !important; }
          .shop-product p { font-size: 11px !important; line-height: 15px !important; }
        }
      `}</style>
    </div>
  );
}

const emptyHint = {
  margin: 0,
  fontSize: 14,
  color: "#888",
  lineHeight: "24px",
} as const;

const clearBtn = {
  marginTop: 14,
  width: "100%",
  border: "1px solid #212529",
  background: "none",
  padding: "8px",
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  cursor: "pointer" as const,
  fontFamily: "inherit",
  color: "#212529",
};

function optBtn(active: boolean) {
  return {
    textAlign: "left" as const,
    background: active ? "#212121" : "none",
    color: active ? "#fff" : "#212529",
    border: "1px solid " + (active ? "#212121" : "rgba(0,0,0,0.15)"),
    padding: "8px 10px",
    fontSize: 14,
    lineHeight: "20px",
    cursor: "pointer" as const,
    fontFamily: "inherit",
  };
}
