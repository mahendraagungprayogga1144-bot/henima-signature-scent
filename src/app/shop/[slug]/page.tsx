import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StockNotifyButton from "@/components/StockNotifyButton";
import KenzoProductImages from "@/components/KenzoProductImages";
import KenzoStickyBuy from "@/components/KenzoStickyBuy";
import ProductLookbookRail from "@/components/ProductLookbookRail";
import { getProductPhotoList } from "@/lib/product-media";
import { getProductStory, mergeProductGallery } from "@/lib/product-stories";

export const dynamic = "force-dynamic";

/** Kenzo FuturaBT stack — matches pasted product-detail CSS */
const FUTURA =
  "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";
const FUTURA_LIGHT =
  "var(--font-futura-nav), FuturaBT-Light, Futura, Century Gothic, sans-serif";
const FUTURA_HEAVY =
  "var(--font-futura-nav), FuturaBT-Heavy, Futura, Century Gothic, sans-serif";
const FUTURA_BOOK =
  "var(--font-futura-nav), FuturaBT-Book, Futura, Century Gothic, sans-serif";
const INK = "#212121";
const MUTED = "#95979d";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await getDatabase();
  const products = (db.products || []).filter((p) => p.active);
  const product = products.find((p) => toSlug(p.name) === slug);
  if (!product) notFound();

  let flashSale: { id?: string; product_id?: string; flash_price?: number } | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("flash_sales")
        .select("*")
        .eq("active", true)
        .lte("start_at", now)
        .gte("end_at", now)
        .limit(1)
        .maybeSingle();
      flashSale = data;
    } catch (e) {
      console.error("flash sale lookup failed:", e);
    }
  }

  const story = getProductStory(slug);
  const variants = Array.isArray(product.variants)
    ? product.variants.filter((v) => v && v.active)
    : [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const dbPhotos = getProductPhotoList(product);
  const photos = mergeProductGallery(slug, dbPhotos, story);

  /** Kenzo: .product-name (grey small) + .category-name (big black) */
  const productNameLine = (
    story?.variantLabel ||
    `${product.name} ${product.isGiftSet ? "Gift Set" : "Extrait de Parfum"}`
  ).toUpperCase();
  const categoryName = (story?.headline || product.name).toUpperCase();

  const description =
    story?.description ||
    product.inspiration ||
    product.description ||
    `${product.name} — an extrait de parfum from Henima. Soft, lasting, made for the moments you want to keep close.`;

  const lifestyle = story?.lifestyle || [];
  const commitment = story?.commitment;
  const lineTitle = story?.lineTitle || "THE HENIMA LINE";

  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      photo: getProductPhotoList(p)[0] || p.photo || "",
      slug: toSlug(p.name),
      line: "Henima",
      subtitle: `${p.name} ${p.isGiftSet ? "Gift Set" : "Extrait de Parfum"}`,
    }));

  return (
    <div className="product-detail kz-pdp">
      {/*
        Kenzo product-container:
        left  = primary-images (tall stack — scrolls first)
        right = sidebar__inner content-sticky (stays while left moves)
      */}
      <div className="kz-product-container">
        <div className="kz-primary-col">
          {/* Mobile order: titles → images (Kenzo d-md-none) */}
          <div className="kz-mobile-titles">
            <p className="kz-product-name">{productNameLine}</p>
            <h1 className="kz-category-name">{categoryName}</h1>
          </div>

          <KenzoProductImages images={photos} productName={product.name} />
        </div>

        <aside className="kz-sidebar-col">
          <KenzoStickyBuy top={140}>
            <div className="kz-sidebar__inner">
              <p className="kz-product-name kz-desk-only">{productNameLine}</p>
              <h1 className="kz-category-name kz-desk-only">{categoryName}</h1>

              <div className="kz-product-desc">
                <p>{description}</p>
              </div>

              {(story?.topNotes || story?.middleNotes || story?.baseNotes) && (
                <div className="kz-notes">
                  {story.topNotes && (
                    <p>
                      <span>Top</span> {story.topNotes}
                    </p>
                  )}
                  {story.middleNotes && (
                    <p>
                      <span>Heart</span> {story.middleNotes}
                    </p>
                  )}
                  {story.baseNotes && (
                    <p>
                      <span>Base</span> {story.baseNotes}
                    </p>
                  )}
                </div>
              )}

              <div className="kz-prices-add-to-cart-actions">
                {!product.comingSoon && totalStock === 0 ? (
                  <>
                    <div className="kz-outline-btn kz-outline-btn--muted">Out of stock</div>
                    <StockNotifyButton productId={product.id} productName={product.name} />
                  </>
                ) : product.comingSoon ? (
                  <div className="kz-outline-btn kz-outline-btn--muted">Coming Soon</div>
                ) : (
                  <AddToCartButton
                    kenzo
                    flashPrice={flashSale?.product_id === product.id ? flashSale?.flash_price : undefined}
                    flashSaleId={flashSale?.id}
                    productId={product.id}
                    productName={product.name}
                    productPhoto={photos[0] || product.photo || ""}
                    variants={variants.map((v) => ({
                      id: v.id,
                      sizeMl: v.sizeMl,
                      originalPrice: Number(v.originalPrice) || 0,
                      active: Boolean(v.active),
                    }))}
                  />
                )}
              </div>

              {product.isGiftSet && (product.bundleItems?.length ?? 0) > 0 && (
                <div className="kz-bundle">
                  <p className="kz-bundle-title">Gift Set includes</p>
                  <ul>
                    {(product.bundleItems || []).map((item) => {
                      const linked = products.find((p) => p.id === item.productId);
                      const label = item.label || linked?.name || item.productId;
                      return (
                        <li key={item.productId}>
                          {linked ? (
                            <Link href={`/shop/${toSlug(linked.name)}`}>{label}</Link>
                          ) : (
                            label
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </KenzoStickyBuy>
        </aside>
      </div>

      {/* Kenzo commitment / story band — grey left text, bottle right */}
      {commitment && (
        <section className="kz-commitment">
          <div className="kz-commitment-inner">
            <div className="kz-commitment-copy">
              <h2 className="kz-commitment-heading">{commitment.title}</h2>
              <p className="kz-commitment-body">{commitment.body}</p>
              {commitment.footnote && (
                <p className="kz-commitment-foot">*{commitment.footnote}</p>
              )}
            </div>
            <div className="kz-commitment-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={commitment.image} alt="" />
            </div>
          </div>
        </section>
      )}

      {/* Lifestyle dual tiles */}
      {lifestyle.length > 0 && (
        <section className="kz-life">
          <div className="kz-life-grid">
            {lifestyle.map((tile) => (
              <div key={tile.src} className="kz-life-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.src} alt="" />
                <div className="kz-life-copy">
                  <h2>{tile.title}</h2>
                  <span>{tile.cta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <ProductLookbookRail title={lineTitle} products={related} hrefAll="/shop" ctaLabel="Discover" />
      )}

      <style>{`
        .kz-pdp {
          background: #fff;
          color: ${INK};
          font-family: ${FUTURA};
          min-height: 100vh;
        }

        /* ===== Kenzo: left stack scrolls; right sticks until images done ===== */
        .kz-product-container {
          display: flex;
          /* stretch = sidebar column as tall as 4-image stack → sticky has room */
          align-items: stretch;
          justify-content: space-around;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .kz-primary-col {
          flex: 0 0 50%;
          max-width: 50%;
          width: 50%;
          background: #fff;
          padding: 24px 24px 80px;
        }
        .kz-sidebar-col {
          flex: 0 0 50%;
          max-width: 50%;
          width: 50%;
          padding: 40px 7vw 80px 3rem;
          /* Must match left stack height so pin lasts through all 4 images */
          align-self: stretch;
          position: relative;
        }

        .kz-sidebar__inner {
          max-width: 420px;
        }

        .kz-mobile-titles { display: none; }
        .kz-desk-only { display: block; }

        /* .product-name — FuturaBT-Heavy 12px #95979d */
        .kz-product-name {
          margin: 0 0 12px;
          font-family: ${FUTURA_HEAVY};
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1.5;
          text-transform: uppercase;
          color: ${MUTED};
        }

        /* .category-name — FuturaBT-Book ~27–40px */
        .kz-category-name {
          margin: 0 0 30px;
          font-family: ${FUTURA_BOOK};
          font-size: 40px;
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 0.93;
          text-transform: uppercase;
          color: #000;
        }

        /* .product-desc — FuturaBT-Light 18px */
        .kz-product-desc {
          margin: 0 0 28px;
        }
        .kz-product-desc p {
          margin: 0;
          font-family: ${FUTURA_LIGHT};
          font-size: 18px;
          font-weight: 300;
          line-height: 1.55;
          color: ${INK};
          text-align: justify;
        }

        .kz-notes {
          margin: 0 0 28px;
        }
        .kz-notes p {
          margin: 0 0 6px;
          font-family: ${FUTURA_LIGHT};
          font-size: 14px;
          font-weight: 300;
          color: ${INK};
        }
        .kz-notes span {
          font-family: ${FUTURA};
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 11px;
          color: ${MUTED};
          margin-right: 8px;
        }

        .kz-prices-add-to-cart-actions {
          margin-bottom: 8px;
          max-width: 280px;
        }

        .kz-outline-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 150px;
          border: 0.5px solid ${INK};
          background: transparent;
          color: ${INK};
          font-family: ${FUTURA_BOOK};
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .kz-outline-btn--muted {
          border-color: rgba(33,33,33,0.25);
          color: #888;
        }

        .kz-bundle {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(33,33,33,0.12);
        }
        .kz-bundle-title {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          font-family: ${FUTURA};
        }
        .kz-bundle ul { list-style: none; margin: 0; padding: 0; }
        .kz-bundle li { margin: 0 0 8px; font-size: 14px; font-family: ${FUTURA_LIGHT}; }
        .kz-bundle a {
          color: ${INK};
          text-decoration: none;
          border-bottom: 1px solid rgba(33,33,33,0.25);
        }

        /* Commitment — Kenzo grey band */
        .kz-commitment {
          background: #f5f5f5;
          padding: 60px 0;
          margin: 40px 0 0;
        }
        .kz-commitment-inner {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .kz-commitment-heading {
          margin: 0 0 20px;
          font-family: ${FUTURA_HEAVY};
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1.2;
          text-transform: uppercase;
          color: #000;
        }
        .kz-commitment-body {
          margin: 0 0 18px;
          font-family: ${FUTURA_LIGHT};
          font-size: 18px;
          font-weight: 300;
          line-height: 1.67;
          color: ${INK};
        }
        .kz-commitment-foot {
          margin: 0;
          font-family: ${FUTURA_LIGHT};
          font-size: 12px;
          line-height: 1.5;
          color: rgba(33,33,33,0.7);
        }
        .kz-commitment-media {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kz-commitment-media img {
          width: 100%;
          max-width: 420px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        /* Lifestyle dual */
        .kz-life {
          background: #fff;
          padding: 2px 0 0;
        }
        .kz-life-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .kz-life-tile {
          position: relative;
          overflow: hidden;
          background: #111;
          aspect-ratio: 1;
        }
        .kz-life-tile img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .kz-life-copy {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);
          padding: 24px;
          z-index: 1;
        }
        .kz-life-copy h2 {
          margin: 0 0 10px;
          font-family: ${FUTURA};
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .kz-life-copy span {
          font-family: ${FUTURA};
          font-size: 13px;
          font-weight: 400;
        }

        @media (max-width: 768.98px) {
          .kz-product-container {
            flex-direction: column;
          }
          .kz-primary-col,
          .kz-sidebar-col {
            flex: 0 0 100%;
            max-width: 100%;
            width: 100%;
            padding: 0 15px 24px;
          }
          .kz-mobile-titles {
            display: block;
            padding: 20px 0 8px;
          }
          .kz-desk-only { display: none; }
          .kz-category-name {
            font-size: 28px;
            margin-bottom: 15px;
          }
          .kz-product-name { font-size: 10px; }
          .kz-sidebar__inner {
            position: static;
            max-width: none;
            top: auto;
          }
          .kz-product-desc p { font-size: 18px; text-align: left; }
          .kz-commitment { padding: 40px 0; margin-top: 20px; }
          .kz-commitment-inner {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 0 20px;
          }
          .kz-commitment-heading { font-size: 22px; }
          .kz-life-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
