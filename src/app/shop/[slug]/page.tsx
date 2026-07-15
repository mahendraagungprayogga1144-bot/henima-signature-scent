import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StockNotifyButton from "@/components/StockNotifyButton";
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews";
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
  const minVariantPrice = variants.length > 0
    ? Math.min(...variants.map((v) => Number(v.originalPrice) || 0))
    : Number(product.originalPrice) || Number(product.discountPrice) || 0;

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh", color: "#1C1917", fontFamily: "var(--font-jost)" }}>

      {/* BREADCRUMB */}
      <div style={{ padding: "16px 8vw", borderBottom: "1px solid rgba(28,25,23,0.06)", display: "flex", gap: "8px", alignItems: "center" }}>
        <Link href="/shop" style={{ fontSize: "11px", color: "#9A8F82", textDecoration: "none", letterSpacing: "1px" }}>Shop</Link>
        <span style={{ fontSize: "11px", color: "#C8B89A" }}>›</span>
        <span style={{ fontSize: "11px", color: "#1C1917" }}>{product.name}</span>
      </div>

      {/* MAIN */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", minHeight: "85vh" }} className="product-detail-grid">

        {/* LEFT — Gallery */}
        <ProductGallery media={media} productName={product.name} comingSoon={Boolean(product.comingSoon)} />

        {/* RIGHT — Info */}
        <div style={{ padding: "64px 8vw 64px", display: "flex", flexDirection: "column", background: "#FAF8F4", overflowY: "auto" }} className="product-detail-right">

          {product.scentFamily && (
            <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "16px" }}>
              {product.scentFamily}
            </p>
          )}

          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, fontStyle: "italic", color: "#1C1917", marginBottom: "6px", lineHeight: 1.1 }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "11px", color: "#9A8F82", marginBottom: "16px", letterSpacing: "1px" }}>Extrait de Parfum · Made in Indonesia</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
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
                  border: "1px solid rgba(200,184,154,0.45)",
                  color: "#B5935A",
                  padding: "6px 10px",
                }}
              >
                {b.label}
              </span>
            ))}
          </div>

          <div style={{ width: "32px", height: "1px", background: "rgba(200,184,154,0.5)", marginBottom: "28px" }} />

          {/* Price */}
          <div style={{ marginBottom: "32px" }}>
            {(variants.length > 0 || minVariantPrice > 0) && !product.comingSoon && (
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 300, color: "#1C1917" }}>
                Rp {minVariantPrice.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          {/* Add to Cart */}
          {!product.comingSoon && totalStock === 0 ? (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ border: "1px solid rgba(28,25,23,0.1)", padding: "12px 16px", textAlign: "center", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#9A8F82" }}>Stok Habis</p>
              </div>
              <StockNotifyButton productId={product.id} productName={product.name} />
            </div>
          ) : product.comingSoon ? (
            <div style={{ border: "1px solid rgba(28,25,23,0.15)", padding: "16px", textAlign: "center", marginBottom: "32px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#9A8F82" }}>Coming Soon</p>
            </div>
          ) : (
            <div style={{ marginBottom: "40px" }}>
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

          {/* Accordion */}
          <div style={{ borderTop: "1px solid rgba(28,25,23,0.1)" }}>

            {(product.inspiration || product.description) && (
              <details style={{ borderBottom: "1px solid rgba(28,25,23,0.1)" }}>
                <summary style={{ padding: "18px 0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#1C1917", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                  Story Behind
                  <span style={{ fontSize: "18px", color: "#C8B89A", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ paddingBottom: "20px" }}>
                  {product.inspiration && (
                    <p style={{ fontSize: "14px", color: "#4A4440", lineHeight: 1.9, marginBottom: "12px", fontWeight: 300 }}>{product.inspiration}</p>
                  )}
                  {product.description && (
                    <p style={{ fontSize: "13px", color: "#9A8F82", lineHeight: 1.8, fontWeight: 300 }}>{product.description}</p>
                  )}
                </div>
              </details>
            )}

            {(product.topNotes || product.middleNotes || product.baseNotes) && (
              <details style={{ borderBottom: "1px solid rgba(28,25,23,0.1)" }}>
                <summary style={{ padding: "18px 0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#1C1917", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                  Notes Description
                  <span style={{ fontSize: "18px", color: "#C8B89A", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ paddingBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {product.topNotes && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Top Notes</p>
                      <p style={{ fontSize: "13px", color: "#4A4440", fontWeight: 300 }}>{product.topNotes}</p>
                    </div>
                  )}
                  {product.middleNotes && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Heart Notes</p>
                      <p style={{ fontSize: "13px", color: "#4A4440", fontWeight: 300 }}>{product.middleNotes}</p>
                    </div>
                  )}
                  {product.baseNotes && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Base Notes</p>
                      <p style={{ fontSize: "13px", color: "#4A4440", fontWeight: 300 }}>{product.baseNotes}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {(product.sillage || product.projection || product.longevity) && (
              <details style={{ borderBottom: "1px solid rgba(28,25,23,0.1)" }}>
                <summary style={{ padding: "18px 0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#1C1917", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                  Product Performance
                  <span style={{ fontSize: "18px", color: "#C8B89A", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ paddingBottom: "20px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  {product.sillage && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Sillage</p>
                      <p style={{ fontSize: "13px", color: "#1C1917", fontWeight: 300 }}>{product.sillage}</p>
                    </div>
                  )}
                  {product.projection && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Projection</p>
                      <p style={{ fontSize: "13px", color: "#1C1917", fontWeight: 300 }}>{product.projection}</p>
                    </div>
                  )}
                  {product.longevity && (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Longevity</p>
                      <p style={{ fontSize: "13px", color: "#1C1917", fontWeight: 300 }}>{product.longevity}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            <details style={{ borderBottom: "1px solid rgba(28,25,23,0.1)" }}>
              <summary style={{ padding: "18px 0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#1C1917", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none", userSelect: "none" }}>
                Shipping Information
                <span style={{ fontSize: "18px", color: "#C8B89A", fontWeight: 300 }}>+</span>
              </summary>
              <div style={{ paddingBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#6B5E52", lineHeight: 1.9, fontWeight: 300 }}>
                  Free shipping for orders above Rp 150.000. Orders are processed within 1-2 business days. Delivery takes 2-5 business days depending on your location.
                </p>
              </div>
            </details>

          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ padding: "0 8vw" }}>
        <ProductReviews reviews={reviews || []} productName={product.name} />
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div style={{ padding: "80px 8vw", borderTop: "1px solid rgba(28,25,23,0.06)" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "40px" }}>You May Also Like</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "2px", background: "rgba(28,25,23,0.06)" }}>
          {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => {
            const relatedVariants = Array.isArray(p.variants) ? p.variants.filter((v) => v && v.active) : [];
            const relatedPrice = relatedVariants.length > 0
              ? Math.min(...relatedVariants.map((v) => Number(v.originalPrice) || 0))
              : Number(p.originalPrice) || Number(p.discountPrice) || 0;
            const relatedPhoto = getProductPhotoList(p)[0] || p.photo || "";
            return (
              <Link key={p.id} href={"/shop/" + toSlug(p.name)} style={{ textDecoration: "none", color: "#1C1917", display: "block", background: "#FAF8F4" }}>
                <div style={{ position: "relative", aspectRatio: "3/4", background: "#F0EBE3", overflow: "hidden" }}>
                  {relatedPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={relatedPhoto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                </div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8B89A", marginBottom: "4px" }}>Extrait de Parfum</p>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", fontWeight: 400, color: "#1C1917" }}>{p.name}</p>
                  <p style={{ fontSize: "13px", color: "#9A8F82", marginTop: "4px" }}>Rp {relatedPrice.toLocaleString("id-ID")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{"@media (max-width: 768px) { .product-detail-grid { grid-template-columns: 1fr !important; } .product-detail-right { padding: 32px 6vw !important; } }"}</style>
    </div>
  );
}
