"use client";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  sizeMl: number;
  originalPrice: number;
  /** Selling price (admin: Harga Diskon). Falls back to originalPrice. */
  discountPrice?: number;
  active: boolean;
}

function variantSellPrice(v: Variant, flashPrice?: number) {
  if (flashPrice && flashPrice > 0) return flashPrice;
  const disc = Number(v.discountPrice) || 0;
  const orig = Number(v.originalPrice) || 0;
  if (disc > 0) return disc;
  return orig;
}

function variantHasStrike(v: Variant, flashPrice?: number) {
  const sell = variantSellPrice(v, flashPrice);
  const orig = Number(v.originalPrice) || 0;
  return orig > 0 && sell > 0 && sell < orig;
}

interface Props {
  productId: string;
  productName: string;
  productPhoto: string;
  variants: Variant[];
  flashPrice?: number;
  flashSaleId?: string;
  /** Kenzo PDP: capacity text links + outline Purchase (no size chips / jumlah block) */
  kenzo?: boolean;
}

const FUTURA = "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";
const INK = "#212529";

export default function AddToCartButton({
  productId,
  productName,
  productPhoto,
  variants,
  flashPrice,
  flashSaleId,
  kenzo = false,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const variant = variants.find((v) => v.id === selectedVariant);

  function handleAdd() {
    if (!variant) return;
    const sell = variantSellPrice(variant, flashPrice);
    addToCart({
      productId,
      productName,
      productPhoto,
      variantId: variant.id,
      sizeMl: variant.sizeMl,
      price: sell,
      isFlashSale: !!flashPrice || variantHasStrike(variant, flashPrice),
      originalPrice: variant.originalPrice,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (kenzo) {
    const sorted = [...variants].sort((a, b) => a.sizeMl - b.sizeMl);
    const unit = variant ? variantSellPrice(variant, flashPrice) : 0;
    const displayPrice = unit * qty;
    const showStrike = variant ? variantHasStrike(variant, flashPrice) : false;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 320 }}>
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: FUTURA,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#95979d",
            }}
          >
            Size
          </p>
          <div
            role="group"
            aria-label="Size"
            style={{
              fontFamily: FUTURA,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            {sorted.map((v, i) => {
              const active = selectedVariant === v.id;
              return (
                <span key={v.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedVariant(v.id)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: FUTURA,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: INK,
                      opacity: active ? 1 : 0.45,
                      textDecoration: "none",
                    }}
                  >
                    {v.sizeMl} ML
                  </button>
                  {i < sorted.length - 1 ? (
                    <span style={{ color: INK, margin: "0 8px", opacity: 0.45 }}>|</span>
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>

        {variant && displayPrice > 0 ? (
          <div>
            {flashPrice ? (
              <p
                style={{
                  margin: "0 0 6px",
                  fontFamily: FUTURA,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#E53935",
                }}
              >
                Flash sale
              </p>
            ) : null}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: FUTURA,
                  fontSize: 26,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  color: showStrike || flashPrice ? "#E53935" : INK,
                }}
              >
                Rp {displayPrice.toLocaleString("id-ID")}
              </p>
              {showStrike ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: FUTURA,
                    fontSize: 14,
                    color: "#95979d",
                    textDecoration: "line-through",
                  }}
                >
                  Rp {(variant.originalPrice * qty).toLocaleString("id-ID")}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: FUTURA,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#95979d",
            }}
          >
            Qty
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: `1px solid rgba(33,37,41,0.35)`,
            }}
          >
            <button
              type="button"
              aria-label="Kurangi"
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 18,
                color: INK,
              }}
            >
              −
            </button>
            <span
              style={{
                width: 40,
                textAlign: "center",
                fontFamily: FUTURA,
                fontSize: 14,
                color: INK,
              }}
            >
              {qty}
            </span>
            <button
              type="button"
              aria-label="Tambah"
              onClick={() => setQty(qty + 1)}
              style={{
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 18,
                color: INK,
              }}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            minWidth: 168,
            height: 44,
            padding: "0 28px",
            border: `1px solid ${INK}`,
            background: added ? INK : "transparent",
            color: added ? "#FFFFFF" : INK,
            fontFamily: FUTURA,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {added ? "Added" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            minWidth: 168,
            height: 44,
            padding: "0 28px",
            border: `1px solid rgba(33,37,41,0.35)`,
            background: "transparent",
            color: INK,
            fontFamily: FUTURA,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Buy now
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "12px",
            fontFamily: FUTURA,
          }}
        >
          Size
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v.id)}
              style={{
                border: selectedVariant === v.id ? "1px solid #212529" : "1px solid rgba(33,37,41,0.25)",
                padding: "12px 18px",
                cursor: "pointer",
                background: selectedVariant === v.id ? "#212529" : "#FFFFFF",
                color: selectedVariant === v.id ? "#FFFFFF" : "#212529",
                transition: "all 0.2s",
                fontFamily: FUTURA,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 500, margin: 0 }}>{v.sizeMl} ML</p>
              <p style={{ fontSize: "11px", fontWeight: 400, marginTop: "6px", opacity: 0.85, marginBottom: 0 }}>
                Rp {variantSellPrice(v, flashPrice).toLocaleString("id-ID")}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#A3A3A3",
            marginBottom: "12px",
            fontFamily: "var(--font-jakarta)",
          }}
        >
          Jumlah
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            border: "1px solid rgba(17,17,17,0.2)",
            width: "fit-content",
          }}
        >
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{
              width: "40px",
              height: "40px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <span
            style={{
              width: "40px",
              textAlign: "center",
              fontSize: "14px",
              fontFamily: "var(--font-jakarta)",
              color: "#111111",
            }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            style={{
              width: "40px",
              height: "40px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
      </div>

      {variant && (
        <div>
          {flashPrice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
                background: "#FFEBEE",
                padding: "6px 12px",
                borderRadius: "4px",
                width: "fit-content",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E53935">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span style={{ fontSize: "11px", color: "#E53935", fontWeight: 600, letterSpacing: "1px" }}>
                FLASH SALE
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <p
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "28px",
                fontWeight: 400,
                color:
                  flashPrice || variantHasStrike(variant, flashPrice) ? "#E53935" : "#111111",
              }}
            >
              Rp {(variantSellPrice(variant, flashPrice) * qty).toLocaleString("id-ID")}
            </p>
            {variantHasStrike(variant, flashPrice) && (
              <p
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "18px",
                  color: "#A3A3A3",
                  textDecoration: "line-through",
                }}
              >
                Rp {(variant.originalPrice * qty).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={handleAdd}
          style={{
            display: "block",
            width: "100%",
            background: added ? "#4A7C59" : "#111111",
            color: "#FFFFFF",
            padding: "16px",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-jakarta)",
            fontWeight: 500,
            transition: "background 0.3s",
          }}
        >
          {added ? "✓ Ditambahkan ke Keranjang" : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#111111",
            padding: "15px",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            border: "1px solid rgba(17,17,17,0.3)",
            cursor: "pointer",
            fontFamily: "var(--font-jakarta)",
            fontWeight: 400,
          }}
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
