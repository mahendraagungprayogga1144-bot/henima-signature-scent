"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, removeFromCart, updateQty, cartTotal, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "cart-style";
    style.innerHTML = "header, footer, .henima-chat-btn { display: none !important; }";
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("cart-style");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    setItems(getCart());
    const onUpdate = () => setItems(getCart());
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const total = cartTotal(items);

  function handleRemove(productId: string, variantId: string) {
    removeFromCart(productId, variantId);
    setItems(getCart());
  }

  function handleQty(productId: string, variantId: string, qty: number) {
    updateQty(productId, variantId, qty);
    setItems(getCart());
  }

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>

      {/* HEADER */}
      <div style={{padding:"32px 8vw", borderBottom:"1px solid rgba(28,25,23,0.08)", display:"flex", alignItems:"center", gap:"16px"}}>
        <Link href="/shop" style={{fontSize:"12px", color:"#9A8F82", textDecoration:"none"}}>← Back to Shopping</Link>
      </div>

      <div style={{padding:"32px 5vw"}}>
        <h1 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, color:"#1C1917", marginBottom:"40px", letterSpacing:"-1px"}}>
          Your Cart {items.length > 0 && <span style={{fontSize:"16px", fontWeight:400, color:"#9A8F82"}}>({items.length} item{items.length > 1 ? "s" : ""})</span>}
        </h1>

        {items.length === 0 ? (
          <div style={{textAlign:"center", padding:"80px 0"}}>
            <p style={{fontSize:"48px", marginBottom:"16px"}}>🛍️</p>
            <p style={{fontSize:"18px", color:"#9A8F82", marginBottom:"32px", fontWeight:300}}>Keranjang kamu masih kosong</p>
            <Link href="/shop" style={{display:"inline-block", background:"#1C1917", color:"#FAF8F4", padding:"14px 32px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none"}}>
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"1fr 360px", gap:"48px", alignItems:"start"}} className="cart-grid">

            {/* ITEMS */}
            <div>
              {/* Header */}
              <div className="cart-header" style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", padding:"0 0 16px", borderBottom:"2px solid #1C1917", marginBottom:"0"}}>
                <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82"}}>Product</p>
                <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", textAlign:"center"}}>Qty</p>
                <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", textAlign:"right"}}>Total</p>
                <p></p>
              </div>

              {items.map((item) => (
                <div key={item.productId + item.variantId}
                  className="cart-item" style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", alignItems:"center", padding:"20px 0", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>

                  {/* Product info */}
                  <div style={{display:"flex", gap:"16px", alignItems:"center"}}>
                    <div style={{position:"relative", width:"72px", height:"72px", background:"#F0EBE3", flexShrink:0, overflow:"hidden"}}>
                      {item.productPhoto && (
                        <Image src={item.productPhoto} alt={item.productName} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px"}}>
                        <p style={{fontSize:"15px", fontWeight:500, color:"#1C1917", margin:0}}>{item.productName}</p>
                        {item.isFlashSale && (
                          <span style={{display:"inline-flex", alignItems:"center", gap:"3px", background:"#FFEBEE", color:"#E53935", fontSize:"10px", fontWeight:600, padding:"2px 8px", borderRadius:"20px"}}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#E53935"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            FLASH SALE
                          </span>
                        )}
                      </div>
                      <p style={{fontSize:"12px", color:"#9A8F82"}}>{item.sizeMl}ml · Extrait de Parfum</p>
                      <div style={{display:"flex", alignItems:"center", gap:"8px", marginTop:"4px"}}>
                        <p style={{fontSize:"13px", color: item.isFlashSale ? "#E53935" : "#1C1917", fontWeight: item.isFlashSale ? 600 : 400, margin:0}}>Rp {item.price.toLocaleString("id-ID")}</p>
                        {item.isFlashSale && item.originalPrice && (
                          <p style={{fontSize:"12px", color:"#9A8F82", textDecoration:"line-through", margin:0}}>Rp {item.originalPrice.toLocaleString("id-ID")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Qty */}
                  <div style={{display:"flex", alignItems:"center", border:"1px solid rgba(28,25,23,0.15)"}}>
                    <button onClick={() => handleQty(item.productId, item.variantId, item.quantity - 1)}
                      style={{width:"32px", height:"32px", background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:"#1C1917"}}>−</button>
                    <span style={{width:"32px", textAlign:"center", fontSize:"13px"}}>{item.quantity}</span>
                    <button onClick={() => handleQty(item.productId, item.variantId, item.quantity + 1)}
                      style={{width:"32px", height:"32px", background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:"#1C1917"}}>+</button>
                  </div>

                  {/* Total */}
                  <p style={{fontSize:"15px", fontWeight:500, color:"#1C1917", textAlign:"right", minWidth:"100px"}}>
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>

                  {/* Remove */}
                  <button onClick={() => handleRemove(item.productId, item.variantId)}
                    style={{background:"none", border:"none", cursor:"pointer", color:"#C8B89A", fontSize:"18px", padding:"4px"}}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div style={{background:"#F0EBE3", padding:"32px", position:"sticky", top:"80px"}}>
              <h2 style={{fontSize:"16px", fontWeight:600, color:"#1C1917", marginBottom:"24px", letterSpacing:"0.5px"}}>Order Summary</h2>

              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"12px"}}>
                <span style={{fontSize:"13px", color:"#9A8F82"}}>Subtotal</span>
                <span style={{fontSize:"13px", color:"#1C1917"}}>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"24px"}}>
                <span style={{fontSize:"13px", color:"#9A8F82"}}>Ongkir</span>
                <span style={{fontSize:"13px", color:"#9A8F82"}}>Dihitung saat checkout</span>
              </div>

              <div style={{height:"1px", background:"rgba(28,25,23,0.1)", marginBottom:"24px"}} />

              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"32px"}}>
                <span style={{fontSize:"15px", fontWeight:600, color:"#1C1917"}}>Total</span>
                <span style={{fontSize:"15px", fontWeight:600, color:"#1C1917"}}>Rp {total.toLocaleString("id-ID")}</span>
              </div>

              <Link href="/checkout"
                style={{display:"block", background:"#1C1917", color:"#FAF8F4", padding:"16px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", textAlign:"center", fontWeight:500}}>
                Checkout
              </Link>

              <Link href="/shop"
                style={{display:"block", background:"transparent", color:"#1C1917", padding:"15px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", textAlign:"center", border:"1px solid rgba(28,25,23,0.2)", marginTop:"10px"}}>
                Lanjut Belanja
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cart-header { display: none !important; }
          .cart-item { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cart-item-info { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
