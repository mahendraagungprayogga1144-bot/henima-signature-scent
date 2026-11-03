"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: Variant[];
};

const COUNTRIES = [
  { code: "SG", label: "Singapore" },
  { code: "MY", label: "Malaysia" },
  { code: "AU", label: "Australia" },
  { code: "US", label: "United States" },
  { code: "ID", label: "Indonesia" },
];

export default function InternationalShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("SG");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetch("/api/shopify/products")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Gagal memuat produk");
        setProducts(data.products || []);
      })
      .catch((e) => setError(e.message || "Error"))
      .finally(() => setLoading(false));
  }, []);

  function addVariant(variantId: string) {
    setCart((prev) => ({ ...prev, [variantId]: (prev[variantId] || 0) + 1 }));
  }

  const lines = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([merchandiseId, quantity]) => ({ merchandiseId, quantity }));

  async function checkout() {
    if (!lines.length) return;
    setCheckingOut(true);
    setError("");
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout gagal");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout gagal");
      setCheckingOut(false);
    }
  }

  function money(amount: string, currency: string) {
    const n = Number(amount);
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(n);
    } catch {
      return `${currency} ${n.toLocaleString()}`;
    }
  }

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh", color: "#1C1917", fontFamily: "var(--font-jakarta)" }}>
      <div style={{ padding: "48px 8vw 24px", borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
        <p style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: "#9A8F82", marginBottom: 12 }}>
          Shopify Markets
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 400, marginBottom: 12 }}>
          International Shop
        </h1>
        <p style={{ fontSize: 14, color: "#6B5E52", maxWidth: 520, lineHeight: 1.7, marginBottom: 20 }}>
          Checkout aman untuk buyer luar negeri via Shopify. Untuk pengiriman dalam negeri Indonesia, pakai{" "}
          <Link href="/shop" style={{ color: "#1C1917" }}>shop lokal</Link>.
        </p>
        <label style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9A8F82" }}>
          Ship to
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              display: "block",
              marginTop: 8,
              padding: "12px 14px",
              border: "1px solid rgba(28,25,23,0.15)",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: 14,
              minWidth: 220,
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ padding: "40px 8vw 100px", maxWidth: 1100, margin: "0 auto" }}>
        {loading && <p style={{ color: "#9A8F82" }}>Memuat produk Shopify…</p>}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffc5c5", padding: 16, marginBottom: 24, fontSize: 13, color: "#b00020" }}>
            {error}
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div style={{ border: "1px solid rgba(28,25,23,0.1)", padding: 40, textAlign: "center" }}>
            <p style={{ marginBottom: 12 }}>Belum ada produk di Shopify.</p>
            <p style={{ fontSize: 13, color: "#9A8F82" }}>
              Tambah produk di{" "}
              <a href="https://admin.shopify.com/store/b9ntkq-s7/products" target="_blank" rel="noreferrer" style={{ color: "#1C1917" }}>
                Shopify Admin → Products
              </a>
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
          {products.map((p) => {
            const variant = p.variants.find((v) => v.availableForSale) || p.variants[0];
            if (!variant) return null;
            const qty = cart[variant.id] || 0;
            return (
              <div key={p.id} style={{ background: "#fff", border: "1px solid rgba(28,25,23,0.08)", overflow: "hidden" }}>
                <div style={{ aspectRatio: "1", background: "#F0EBE3" }}>
                  {p.featuredImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                </div>
                <div style={{ padding: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{p.title}</h2>
                  <p style={{ fontSize: 13, color: "#9A8F82", marginBottom: 16 }}>
                    {money(variant.price.amount, variant.price.currencyCode)}
                    {p.variants.length > 1 ? ` · ${variant.title}` : ""}
                  </p>
                  <button
                    type="button"
                    disabled={!variant.availableForSale}
                    onClick={() => addVariant(variant.id)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: variant.availableForSale ? "#1C1917" : "#ccc",
                      color: "#FAF8F4",
                      border: "none",
                      fontSize: 10,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: variant.availableForSale ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                    }}
                  >
                    {qty > 0 ? `Added ×${qty}` : "Add to bag"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lines.length > 0 && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "#1C1917",
            color: "#FAF8F4",
            padding: "16px 8vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            zIndex: 50,
          }}
        >
          <p style={{ fontSize: 13, margin: 0 }}>
            {lines.reduce((s, l) => s + l.quantity, 0)} item · Ship to {country}
          </p>
          <button
            type="button"
            onClick={checkout}
            disabled={checkingOut}
            style={{
              background: "#FAF8F4",
              color: "#1C1917",
              border: "none",
              padding: "12px 24px",
              fontSize: 10,
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            {checkingOut ? "Redirecting…" : "Checkout with Shopify"}
          </button>
        </div>
      )}
    </div>
  );
}
