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
    <div style={{ background: "#FFFFFF", minHeight: "100vh", color: "#111111", fontFamily: "var(--font-jakarta)" }}>
      {/* MAIN — gallery sticky + buy panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 0, minHeight: "100svh" }} className="product-detail-grid">
        <ProductGallery media={media} productName={product.name} comingSoon={Boolean(product.comingSoon)} />

        <div style={{ padding: "48px 7vw 80px", display: "flex", flexDirection: "column", background: "#FFFFFF" }} className="product-detail-right">
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "36px" }}>
            <Link href="/shop" style={{ fontSize: "11px", color: "#A3A3A3", textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Shop
            </Link>
            <span style={{ fontSize: "11px", color: "#D4D4D4" }}>/</span>
            <span style={{ fontSize: "11px", color: "#111111", letterSpacing: "0.08em" }}>{product.name}</span>
          </div>

          <p style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "16px" }}>
            {product.scentFamily || (product.isGiftSet ? "Gift Set" : "Extrait de Parfum")}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "12px",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {product.name}
          </h1>
          <p style={{ fontSize: "12px", color: "#A3A3A3", marginBottom: "28px", letterSpacing: "0.08em" }}>
            Made in Indonesia
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {product.isGiftSet && (
              <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", background: "#111111", color: "#FFFFFF", padding: "6px 10px" }}>
                Gift Set
              </span>
            )}
            {[
              { label: "BPOM Registered", hint: "Terdaftar di BPOM" },
              { label: "Halal Ready", hint: "Proses & standar halal brand" },
              { label: "Batch Tracked", hint: "Produksi per batch tercatat" },
            ].map((b) => (
              <span
                key={b.label}
                title={b.hint}
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  border: "1px solid rgba(17,17,17,0.15)",
                  color: "#737373",
                  padding: "6px 10px",
                }}
              >
                {b.label}
              </span>
            ))}
          </div>

          {(product.inspiration || product.description) && (
            <p style={{ fontSize: "15px", color: "#525252", lineHeight: 1.85, fontWeight: 300, marginBottom: "32px", maxWidth: "440px" }}>
              {product.inspiration || product.description}
            </p>
          )}

          <div style={{ width: "32px", height: "1px", background: "rgba(17,17,17,0.2)", marginBottom: "28px" }} />

          {(variants.length > 0 || minVariantPrice > 0) && !product.comingSoon && (
            <p style={{ fontFamily: "var(--font-jakarta)", fontSize: "28px", fontWeight: 300, color: "#111111", marginBottom: "28px" }}>
              Rp {minVariantPrice.toLocaleString("id-ID")}
            </p>
          )}

          {!product.comingSoon && totalStock === 0 ? (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ border: "1px solid rgba(17,17,17,0.1)", padding: "14px 16px", textAlign: "center", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#A3A3A3", margin: 0 }}>Stok Habis</p>
              </div>
              <StockNotifyButton productId={product.id} productName={product.name} />
            </div>
          ) : product.comingSoon ? (
            <div style={{ border: "1px solid rgba(17,17,17,0.15)", padding: "16px", textAlign: "center", marginBottom: "32px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#A3A3A3", margin: 0 }}>Coming Soon</p>
            </div>
          ) : (
            <div style={{ marginBottom: "48px" }}>
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
            <div style={{ marginBottom: 36, border: "1px solid rgba(17,17,17,0.1)", padding: "20px 22px" }}>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#737373", marginBottom: 14 }}>
                Isi Gift Set
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {(product.bundleItems || []).map((item) => {
                  const linked = products.find((p) => p.id === item.productId);
                  const label = item.label || linked?.name || item.productId;
                  return (
                    <li key={item.productId} style={{ fontSize: 14, color: "#525252" }}>
                      {linked ? (
                        <Link href={`/shop/${toSlug(linked.name)}`} style={{ color: "#111111", textDecoration: "none", borderBottom: "1px solid rgba(17,17,17,0.2)" }}>
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

          {/* Notes strip */}
          {(product.topNotes || product.middleNotes || product.baseNotes) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", padding: "28px 0", borderTop: "1px solid rgba(17,17,17,0.08)", borderBottom: "1px solid rgba(17,17,17,0.08)", marginBottom: "8px" }} className="notes-grid">
              {product.topNotes && (
                <div>
                  <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "8px" }}>Top</p>
                  <p style={{ fontSize: "13px", color: "#404040", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{product.topNotes}</p>
                </div>
              )}
              {product.middleNotes && (
                <div>
                  <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "8px" }}>Heart</p>
                  <p style={{ fontSize: "13px", color: "#404040", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{product.middleNotes}</p>
                </div>
              )}
              {product.baseNotes && (
                <div>
                  <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "8px" }}>Base</p>
                  <p style={{ fontSize: "13px", color: "#404040", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{product.baseNotes}</p>
                </div>
              )}
            </div>
          )}

          <div style={{ borderTop: product.topNotes || product.middleNotes || product.baseNotes ? "none" : "1px solid rgba(17,17,17,0.1)" }}>
            {(product.inspiration || product.description) && (
              <details style={{ borderBottom: "1px solid rgba(17,17,17,0.1)" }}>
                <summary style={{ padding: "18px 0", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#111111", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                  Story Behind
                  <span style={{ fontSize: "18px", color: "#A3A3A3", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ paddingBottom: "20px" }}>
                  {product.inspiration && (
                    <p style={{ fontSize: "14px", color: "#525252", lineHeight: 1.9, marginBottom: "12px", fontWeight: 300 }}>{product.inspiration}</p>
                  )}
                  {product.description && (
                    <p style={{ fontSize: "13px", color: "#A3A3A3", lineHeight: 1.8, fontWeight: 300 }}>{product.description}</p>
                  )}
                </div>
              </details>
            )}

            {(product.sillage || product.projection || product.longevity) && (
              <details style={{ borderBottom: "1px solid rgba(17,17,17,0.1)" }}>
                <summary style={{ padding: "18px 0", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#111111", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                  Performance
                  <span style={{ fontSize: "18px", color: "#A3A3A3", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ paddingBottom: "20px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  {product.sillage && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "4px" }}>Sillage</p>
                      <p style={{ fontSize: "13px", color: "#111111", fontWeight: 300 }}>{product.sillage}</p>
                    </div>
                  )}
                  {product.projection && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "4px" }}>Projection</p>
                      <p style={{ fontSize: "13px", color: "#111111", fontWeight: 300 }}>{product.projection}</p>
                    </div>
                  )}
                  {product.longevity && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "4px" }}>Longevity</p>
                      <p style={{ fontSize: "13px", color: "#111111", fontWeight: 300 }}>{product.longevity}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            <details style={{ borderBottom: "1px solid rgba(17,17,17,0.1)" }}>
              <summary style={{ padding: "18px 0", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#111111", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                Shipping
                <span style={{ fontSize: "18px", color: "#A3A3A3", fontWeight: 300 }}>+</span>
              </summary>
              <div style={{ paddingBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#737373", lineHeight: 1.9, fontWeight: 300 }}>
                  Free shipping for orders above Rp 150.000. Orders are processed within 1-2 business days. Delivery takes 2-5 business days depending on your location.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 8vw", borderTop: "1px solid rgba(17,17,17,0.06)" }}>
        <ProductReviews reviews={reviews || []} productName={product.name} />
      </div>

      <ProductLookbookRail title="You may also like" products={related} />

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .product-detail-right { padding: 32px 6vw 64px !important; }
          .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
