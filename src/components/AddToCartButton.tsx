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
}

export default function AddToCartButton({ productId, productName, productPhoto, variants }: Props) {
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
      price: variant.originalPrice,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new Event("cart-updated"));
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>
      {/* Size selector */}
      <div>
        <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>Pilih Ukuran</p>
        <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}}>
          {variants.map((v) => (
            <button key={v.id} onClick={() => setSelectedVariant(v.id)}
              style={{
                border: selectedVariant === v.id ? "2px solid #1C1917" : "1px solid rgba(28,25,23,0.2)",
                padding:"10px 20px", cursor:"pointer",
                background: selectedVariant === v.id ? "#1C1917" : "#FAF8F4",
                color: selectedVariant === v.id ? "#FAF8F4" : "#1C1917",
                transition:"all 0.2s", fontFamily:"var(--font-jost)",
              }}>
              <p style={{fontSize:"12px", fontWeight:400}}>{v.sizeMl}ml</p>
              <p style={{fontSize:"13px", fontWeight:500, marginTop:"4px"}}>
                Rp {v.originalPrice.toLocaleString("id-ID")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>Jumlah</p>
        <div style={{display:"flex", alignItems:"center", gap:"0", border:"1px solid rgba(28,25,23,0.2)", width:"fit-content"}}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            style={{width:"40px", height:"40px", background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"#1C1917", display:"flex", alignItems:"center", justifyContent:"center"}}>
            −
          </button>
          <span style={{width:"40px", textAlign:"center", fontSize:"14px", fontFamily:"var(--font-jost)", color:"#1C1917"}}>{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            style={{width:"40px", height:"40px", background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"#1C1917", display:"flex", alignItems:"center", justifyContent:"center"}}>
            +
          </button>
        </div>
      </div>

      {/* Price */}
      {variant && (
        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"28px", fontWeight:400, color:"#1C1917"}}>
          Rp {(variant.originalPrice * qty).toLocaleString("id-ID")}
        </p>
      )}

      {/* Buttons */}
      <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
        <button onClick={handleAdd}
          style={{
            display:"block", width:"100%",
            background: added ? "#4A7C59" : "#1C1917",
            color:"#FAF8F4", padding:"16px",
            fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
            border:"none", cursor:"pointer", fontFamily:"var(--font-jost)", fontWeight:500,
            transition:"background 0.3s",
          }}>
          {added ? "✓ Ditambahkan ke Keranjang" : "Add to Cart"}
        </button>
        <button onClick={() => { handleAdd(); router.push("/cart"); }}
          style={{
            display:"block", width:"100%",
            background:"transparent", color:"#1C1917",
            padding:"15px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
            border:"1px solid rgba(28,25,23,0.3)", cursor:"pointer",
            fontFamily:"var(--font-jost)", fontWeight:400,
          }}>
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
