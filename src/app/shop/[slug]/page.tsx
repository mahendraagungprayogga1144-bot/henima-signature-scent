import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StockNotifyButton from "@/components/StockNotifyButton";
import ProductGallery from "@/components/ProductGallery";
import ProductLookbookRail from "@/components/ProductLookbookRail";
import { buildProductMedia, getProductPhotoList } from "@/lib/product-media";
import { getProductStory, mergeProductGallery } from "@/lib/product-stories";

export const dynamic = "force-dynamic";

const FUTURA =
  "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";
const INK = "#212529";
const MUTED = "#95979D";

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
  const media = buildProductMedia(photos, product.video);

  /** Kenzo tokens: product-name (grey) + category-name (big) */
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
    <div className="kz-pdp" style={{ background: "#FFFFFF", color: INK, fontFamily: FUTURA, minHeight: "100vh" }}>
      {/* ===== Kenzo product-detail: images | buy ===== */}
      <div className="kz-pdp-top">
        <div className="kz-pdp-images">
          {/* Mobile titles — Kenzo d-md-none order */}
          <div className="kz-pdp-mobile-titles">
            <h4 className="kz-pdp-product-name">{productNameLine}</h4>
            <h1 className="kz-pdp-category-name">{categoryName}</h1>
          </div>

          <ProductGallery
            media={media}
            productName={product.name}
            comingSoon={Boolean(product.comingSoon)}
            kenzoFit
          />
        </div>

        <div className="kz-pdp-buy">
          <div className="kz-pdp-sticky">
            <h1 className="kz-pdp-product-name kz-pdp-product-name--desk">{productNameLine}</h1>
            <h1 className="kz-pdp-category-name kz-pdp-category-name--desk">{categoryName}</h1>

            <div className="kz-pdp-desc">
              <p>{description}</p>
            </div>

            <div className="kz-pdp-actions">
              {!product.comingSoon && totalStock === 0 ? (
                <>
                  <div className="kz-pdp-outline-btn kz-pdp-outline-btn--muted">Out of stock</div>
                  <StockNotifyButton productId={product.id} productName={product.name} />
                </>
              ) : product.comingSoon ? (
                <div className="kz-pdp-outline-btn kz-pdp-outline-btn--muted">Coming Soon</div>
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
              <div className="kz-pdp-bundle">
                <p className="kz-pdp-bundle-title">Gift Set includes</p>
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
        </div>
      </div>

      {/* ===== Lifestyle dual tiles — Kenzo OUR STORES / Happenings pattern ===== */}
      {lifestyle.length > 0 && (
        <section className="kz-pdp-life">
          <div className="kz-pdp-life-grid">
            {lifestyle.map((tile) => (
              <div key={tile.src} className="kz-pdp-life-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.src} alt="" />
                <div className="kz-pdp-life-copy">
                  <h2>{tile.title}</h2>
                  <span>{tile.cta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Line rail — Kenzo red title ===== */}
      {related.length > 0 && (
        <ProductLookbookRail title={lineTitle} products={related} hrefAll="/shop" ctaLabel="Discover" />
      )}

      <style>{`
        .kz-pdp-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100svh - 120px);
        }
        .kz-pdp-images {
          background: #FFFFFF;
          min-height: calc(100svh - 120px);
        }
        .kz-pdp-mobile-titles { display: none; }

        .kz-pdp-buy {
          padding: 56px 7vw 64px 48px;
          display: flex;
          align-items: flex-start;
        }
        .kz-pdp-sticky {
          position: sticky;
          top: 110px;
          width: 100%;
          max-width: 460px;
        }

        /* Kenzo .product-name — 12px / 900 / #95979D */
        .kz-pdp-product-name {
          margin: 0 0 10px;
          font-family: ${FUTURA};
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.02em;
          line-height: 1.35;
          text-transform: uppercase;
          color: ${MUTED};
        }
        .kz-pdp-product-name--desk { display: block; }

        /* Kenzo .category-name — 40px / 500 */
        .kz-pdp-category-name {
          margin: 0 0 28px;
          font-family: ${FUTURA};
          font-size: 40px;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.1;
          text-transform: uppercase;
          color: ${INK};
        }
        .kz-pdp-category-name--desk { display: block; }

        /* Kenzo .product-desc — 18px / 300 */
        .kz-pdp-desc {
          margin: 0 0 36px;
        }
        .kz-pdp-desc p {
          margin: 0;
          font-family: ${FUTURA};
          font-size: 18px;
          font-weight: 300;
          line-height: 1.55;
          color: #212121;
        }

        .kz-pdp-actions { margin-bottom: 8px; max-width: 320px; }

        .kz-pdp-outline-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160px;
          height: 44px;
          padding: 0 24px;
          border: 1px solid ${INK};
          background: transparent;
          color: ${INK};
          font-family: ${FUTURA};
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .kz-pdp-outline-btn--muted {
          border-color: rgba(33,37,41,0.25);
          color: #888;
        }

        .kz-pdp-bundle { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(33,37,41,0.1); }
        .kz-pdp-bundle-title {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
        }
        .kz-pdp-bundle ul { list-style: none; margin: 0; padding: 0; }
        .kz-pdp-bundle li { margin: 0 0 8px; font-size: 14px; }
        .kz-pdp-bundle a { color: ${INK}; text-decoration: none; border-bottom: 1px solid rgba(33,37,41,0.25); }

        /* Lifestyle dual — Kenzo chapter tiles */
        .kz-pdp-life {
          background: #FFFFFF;
          padding: 8px 0 0;
        }
        .kz-pdp-life-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .kz-pdp-life-tile {
          position: relative;
          overflow: hidden;
          background: #111;
          aspect-ratio: 1;
        }
        .kz-pdp-life-tile img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .kz-pdp-life-copy {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #FFFFFF;
          background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%);
          padding: 24px;
          z-index: 1;
        }
        .kz-pdp-life-copy h2 {
          margin: 0 0 10px;
          font-family: ${FUTURA};
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .kz-pdp-life-copy span {
          font-family: ${FUTURA};
          font-size: 13px;
          font-weight: 400;
        }

        @media (max-width: 900px) {
          .kz-pdp-top {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .kz-pdp-images { min-height: auto; }
          .kz-pdp-mobile-titles {
            display: block;
            padding: 20px 20px 8px;
          }
          .kz-pdp-product-name--desk,
          .kz-pdp-category-name--desk { display: none; }
          .kz-pdp-category-name { font-size: 28px; margin-bottom: 8px; }
          .kz-pdp-buy { padding: 8px 20px 48px; }
          .kz-pdp-sticky { position: static; max-width: none; }
          .kz-pdp-desc p { font-size: 16px; }
          .kz-pdp-life-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
