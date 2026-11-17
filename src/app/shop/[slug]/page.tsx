import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StockNotifyButton from "@/components/StockNotifyButton";
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews";
import ProductLookbookRail from "@/components/ProductLookbookRail";
import { getProductReviews } from "@/lib/reviews";
import { buildProductMedia, getProductPhotoList } from "@/lib/product-media";

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

  let reviews: Awaited<ReturnType<typeof getProductReviews>> = [];
  try {
    reviews = await getProductReviews(product.id);
  } catch (e) {
    console.error("reviews lookup failed:", e);
  }

  const variants = Array.isArray(product.variants)
    ? product.variants.filter((v) => v && v.active)
    : [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const photos = getProductPhotoList(product);
  const media = buildProductMedia(photos, product.video);
  const minVariantPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => Number(v.originalPrice) || 0))
      : Number(product.originalPrice) || Number(product.discountPrice) || 0;

  const sizeLine =
    variants.length > 0
      ? variants
          .map((v) => v.sizeMl)
          .sort((a, b) => a - b)
          .map((ml) => `${ml} ML`)
          .join("  |  ")
      : null;

  const story = product.inspiration || product.description || "";
  const concentration = product.isGiftSet
    ? "Gift Set"
    : product.scentFamily || "Extrait de Parfum";

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
    <div
      style={{
        background: "#FFFFFF",
        minHeight: "100vh",
        color: INK,
        fontFamily: FUTURA,
      }}
    >
      {/* Kenzo PDP: imagery | story + buy */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 0, minHeight: "100svh" }}
        className="product-detail-grid"
      >
        <ProductGallery media={media} productName={product.name} comingSoon={Boolean(product.comingSoon)} />

        <div
          className="product-detail-right"
          style={{
            padding: "56px 8vw 80px",
            display: "flex",
            flexDirection: "column",
            background: "#FFFFFF",
            justifyContent: "center",
          }}
        >
          <Link
            href="/shop"
            style={{
              fontSize: 12,
              color: "#888",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 28,
              fontFamily: FUTURA,
              width: "fit-content",
            }}
          >
            ← All products
          </Link>

          {/* Kenzo: huge uppercase name */}
          <h1
            style={{
              fontFamily: FUTURA,
              fontSize: "clamp(36px, 5.2vw, 64px)",
              fontWeight: 500,
              color: INK,
              margin: "0 0 20px",
              lineHeight: 1.05,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888",
              margin: "0 0 28px",
              fontFamily: FUTURA,
            }}
          >
            {concentration}
            {product.comingSoon ? " · Coming soon" : ""}
          </p>

          {/* Perfume story — Kenzo narrative block */}
          {story ? (
            <p
              style={{
                fontSize: 15,
                color: INK,
                lineHeight: 1.75,
                fontWeight: 400,
                margin: "0 0 28px",
                maxWidth: 460,
                fontFamily: FUTURA,
              }}
            >
              {story}
            </p>
          ) : null}

          {/* Kenzo size line: 30 ML | 50 ML | 100 ML */}
          {sizeLine ? (
            <p
              style={{
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: INK,
                margin: "0 0 28px",
                fontFamily: FUTURA,
                fontWeight: 500,
              }}
            >
              {sizeLine}
            </p>
          ) : null}

          {(variants.length > 0 || minVariantPrice > 0) && !product.comingSoon && (
            <p
              style={{
                fontFamily: FUTURA,
                fontSize: 22,
                fontWeight: 500,
                color: INK,
                margin: "0 0 28px",
                letterSpacing: "0.02em",
              }}
            >
              Rp {minVariantPrice.toLocaleString("id-ID")}
              {variants.length > 1 ? " · from" : ""}
            </p>
          )}

          {!product.comingSoon && totalStock === 0 ? (
            <div style={{ marginBottom: 40, maxWidth: 420 }}>
              <div
                style={{
                  border: "1px solid rgba(33,37,41,0.2)",
                  padding: "14px 16px",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", margin: 0 }}>
                  Stok Habis
                </p>
              </div>
              <StockNotifyButton productId={product.id} productName={product.name} />
            </div>
          ) : product.comingSoon ? (
            <div
              style={{
                border: "1px solid rgba(33,37,41,0.25)",
                padding: "16px 24px",
                textAlign: "center",
                marginBottom: 32,
                maxWidth: 280,
              }}
            >
              <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: INK, margin: 0 }}>
                Coming Soon
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: 48, maxWidth: 420 }}>
              <AddToCartButton
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
            </div>
          )}

          {product.isGiftSet && (product.bundleItems?.length ?? 0) > 0 && (
            <div style={{ marginBottom: 36, borderTop: "1px solid rgba(33,37,41,0.1)", paddingTop: 24, maxWidth: 460 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 14 }}>
                Isi Gift Set
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {(product.bundleItems || []).map((item) => {
                  const linked = products.find((p) => p.id === item.productId);
                  const label = item.label || linked?.name || item.productId;
                  return (
                    <li key={item.productId} style={{ fontSize: 14, color: INK }}>
                      {linked ? (
                        <Link href={`/shop/${toSlug(linked.name)}`} style={{ color: INK, textDecoration: "none", borderBottom: "1px solid rgba(33,37,41,0.25)" }}>
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {(product.topNotes || product.middleNotes || product.baseNotes) && (
            <div
              className="notes-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
                padding: "28px 0",
                borderTop: "1px solid rgba(33,37,41,0.1)",
                maxWidth: 480,
              }}
            >
              {product.topNotes && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Top</p>
                  <p style={{ fontSize: 13, color: INK, fontWeight: 400, lineHeight: 1.55, margin: 0 }}>{product.topNotes}</p>
                </div>
              )}
              {product.middleNotes && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Heart</p>
                  <p style={{ fontSize: 13, color: INK, fontWeight: 400, lineHeight: 1.55, margin: 0 }}>{product.middleNotes}</p>
                </div>
              )}
              {product.baseNotes && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Base</p>
                  <p style={{ fontSize: 13, color: INK, fontWeight: 400, lineHeight: 1.55, margin: 0 }}>{product.baseNotes}</p>
                </div>
              )}
            </div>
          )}

          {(product.sillage || product.projection || product.longevity) && (
            <details style={{ borderTop: "1px solid rgba(33,37,41,0.1)", maxWidth: 480 }}>
              <summary
                style={{
                  padding: "18px 0",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: INK,
                  cursor: "pointer",
                  listStyle: "none",
                  fontFamily: FUTURA,
                }}
              >
                Performance
              </summary>
              <div style={{ paddingBottom: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
                {product.sillage && (
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 4 }}>Sillage</p>
                    <p style={{ fontSize: 13, color: INK, margin: 0 }}>{product.sillage}</p>
                  </div>
                )}
                {product.projection && (
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 4 }}>Projection</p>
                    <p style={{ fontSize: 13, color: INK, margin: 0 }}>{product.projection}</p>
                  </div>
                )}
                {product.longevity && (
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 4 }}>Longevity</p>
                    <p style={{ fontSize: 13, color: INK, margin: 0 }}>{product.longevity}</p>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>

      <div style={{ padding: "0 8vw", borderTop: "1px solid rgba(33,37,41,0.06)" }}>
        <ProductReviews reviews={reviews || []} productName={product.name} />
      </div>

      <ProductLookbookRail title="You may also like" products={related} />

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .product-detail-right {
            padding: 36px 6vw 64px !important;
            justify-content: flex-start !important;
          }
          .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
