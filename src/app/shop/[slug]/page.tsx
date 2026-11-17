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

  const concentration = product.isGiftSet
    ? "Gift Set"
    : product.scentFamily || story?.variantLabel || "Extrait de Parfum";

  /** Kenzo hierarchy: small variant line, BIG product name (not brand) */
  const variantLine = `${product.name} ${concentration}`;
  const headline = (story?.headline || product.name).toUpperCase();

  const paragraphs =
    story?.paragraphs?.length
      ? story.paragraphs
      : [product.inspiration, product.description]
          .filter(Boolean)
          .join("\n\n")
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean);

  const topNotes = story?.topNotes || product.topNotes;
  const middleNotes = story?.middleNotes || product.middleNotes;
  const baseNotes = story?.baseNotes || product.baseNotes;

  const storyImage =
    photos.find((p) => p.includes("lifestyle")) ||
    story?.gallery?.[1] ||
    photos[1] ||
    photos[0] ||
    "";
  const storyBandTitle = story?.storyBandTitle || `THE STORY BEHIND ${product.name.toUpperCase()}`;

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
      <div className="kz-pdp-top">
        <div className="kz-pdp-images">
          <ProductGallery
            media={media}
            productName={product.name}
            comingSoon={Boolean(product.comingSoon)}
            kenzoFit
          />
        </div>

        <div className="kz-pdp-buy">
          <div className="kz-pdp-sticky">
            {/* Mobile: big name first */}
            <h1 className="kz-pdp-headline kz-pdp-headline--mobile">{headline}</h1>

            {/* Desktop Kenzo: small variant → big product name */}
            <p className="kz-pdp-variant">{variantLine}</p>
            <h1 className="kz-pdp-headline kz-pdp-headline--desktop">{headline}</h1>

            {paragraphs.length > 0 ? (
              <div className="kz-pdp-desc">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <div className="kz-pdp-desc">
                <p>
                  {product.name} — an extrait de parfum from Henima. Soft, lasting, made for the
                  moments you want to keep close.
                </p>
              </div>
            )}

            {(topNotes || middleNotes || baseNotes) && (
              <p className="kz-pdp-notes-line">
                {[
                  topNotes && `Top: ${topNotes}`,
                  middleNotes && `Heart: ${middleNotes}`,
                  baseNotes && `Base: ${baseNotes}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

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

      {/* Story band — lifestyle + narrative */}
      <section className="kz-pdp-storyband">
        <div className="kz-pdp-storyband-inner">
          <div className="kz-pdp-storyband-card">
            <h2>{storyBandTitle}</h2>
            <div className="kz-pdp-storyband-text">
              {story?.storyBandExtra ? <p>{story.storyBandExtra}</p> : null}
              {paragraphs.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {(product.sillage || product.longevity) && (
                <p>
                  {[
                    product.sillage && `Sillage: ${product.sillage}`,
                    product.projection && `Projection: ${product.projection}`,
                    product.longevity && `Longevity: ${product.longevity}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
          <div className="kz-pdp-storyband-media">
            {storyImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={storyImage} alt={product.name} />
            ) : null}
          </div>
        </div>
      </section>

      {/* Second lifestyle strip when curated gallery has 2+ shots */}
      {story?.gallery && story.gallery.length > 1 ? (
        <section className="kz-pdp-lifestyle">
          <div className="kz-pdp-lifestyle-inner">
            {story.gallery.slice(0, 2).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 && (
        <ProductLookbookRail title="The Henima line" products={related} hrefAll="/shop" ctaLabel="Discover" />
      )}

      <style>{`
        .kz-pdp-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: 100svh;
          max-width: 1400px;
          margin: 0 auto;
        }
        .kz-pdp-images {
          background: #F5F5F5;
          min-height: 100svh;
        }
        .kz-pdp-buy {
          padding: 48px 6vw 64px;
          display: flex;
          align-items: flex-start;
        }
        .kz-pdp-sticky {
          position: sticky;
          top: 96px;
          width: 100%;
          max-width: 520px;
        }

        .kz-pdp-variant {
          margin: 0 0 10px;
          font-family: ${FUTURA};
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.04em;
          line-height: 1.35;
          color: ${INK};
        }
        .kz-pdp-headline {
          margin: 0 0 28px;
          font-family: ${FUTURA};
          font-size: clamp(34px, 4.5vw, 52px);
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1.05;
          text-transform: uppercase;
          color: ${INK};
        }
        .kz-pdp-headline--mobile { display: none; }
        .kz-pdp-headline--desktop { display: block; }

        .kz-pdp-desc { margin: 0 0 24px; }
        .kz-pdp-desc p {
          margin: 0 0 16px;
          font-size: 14px;
          line-height: 1.75;
          font-weight: 400;
          color: ${INK};
          font-family: ${FUTURA};
        }
        .kz-pdp-desc p:last-child { margin-bottom: 0; }

        .kz-pdp-notes-line {
          margin: 0 0 28px;
          font-size: 12px;
          line-height: 1.6;
          color: #666;
          font-family: ${FUTURA};
        }

        .kz-pdp-actions { margin-bottom: 8px; max-width: 400px; }

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

        .kz-pdp-storyband {
          background: #F5F5F5;
          padding: 72px 0;
        }
        .kz-pdp-storyband-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .kz-pdp-storyband-card {
          background: #FFFFFF;
          border: 6px solid #F5F5F5;
          padding: 40px 36px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.04);
        }
        .kz-pdp-storyband-card h2 {
          margin: 0 0 20px;
          font-family: ${FUTURA};
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.3;
          color: ${INK};
        }
        .kz-pdp-storyband-text p {
          margin: 0 0 14px;
          font-size: 14px;
          line-height: 1.75;
          color: ${INK};
          font-family: ${FUTURA};
        }
        .kz-pdp-storyband-text p:last-child { margin-bottom: 0; }
        .kz-pdp-storyband-media {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .kz-pdp-storyband-media img {
          width: 100%;
          max-width: 480px;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }

        .kz-pdp-lifestyle {
          background: #FFFFFF;
          padding: 0 0 72px;
        }
        .kz-pdp-lifestyle-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .kz-pdp-lifestyle-inner img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          background: #F5F5F5;
        }

        @media (max-width: 900px) {
          .kz-pdp-top {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .kz-pdp-images { min-height: auto; }
          .kz-pdp-buy { padding: 28px 20px 48px; }
          .kz-pdp-sticky { position: static; max-width: none; }
          .kz-pdp-headline--mobile {
            display: block;
            margin-bottom: 12px;
            font-size: 28px;
          }
          .kz-pdp-headline--desktop { display: none; }
          .kz-pdp-storyband { padding: 48px 0; }
          .kz-pdp-storyband-inner {
            display: flex;
            flex-direction: column-reverse;
            grid-template-columns: 1fr;
            padding: 0 16px;
            gap: 28px;
          }
          .kz-pdp-storyband-card { padding: 28px 22px; }
          .kz-pdp-lifestyle { padding-bottom: 48px; }
          .kz-pdp-lifestyle-inner {
            grid-template-columns: 1fr;
            padding: 0 16px;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
}
