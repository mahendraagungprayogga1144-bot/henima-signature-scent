"use client";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  sizeMl: number;
  originalPrice: number;
  active: boolean;
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
    addToCart({
      productId,
      productName,
      productPhoto,
      variantId: variant.id,
      sizeMl: variant.sizeMl,
      price: flashPrice || variant.originalPrice,
      isFlashSale: !!flashPrice,
      originalPrice: variant.originalPrice,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (kenzo) {
    const sorted = [...variants].sort((a, b) => a.sizeMl - b.sizeMl);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 280 }}>
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
          {added ? "Added" : "Purchase"}
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
                Rp {v.originalPrice.toLocaleString("id-ID")}
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
                color: flashPrice ? "#E53935" : "#111111",
              }}
            >
              Rp {((flashPrice || variant.originalPrice) * qty).toLocaleString("id-ID")}
            </p>
            {flashPrice && (
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
