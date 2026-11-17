"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, removeFromCart, updateQty, cartTotal, type CartItem } from "@/lib/cart";

/** Cart — tipografi Futura ala Kenzo / Our Story, spacing rapat, CTA merah #A30116 */
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

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
    <div className="cart-wrap">
      <div className="cart-bar">
        <Link href="/shop" className="cart-back">
          ← Back to Shopping
        </Link>
      </div>

      <div className="cart-body">
        <h1 className="cart-title">
          Your Cart
          {items.length > 0 && (
            <span className="cart-count">
              ({items.length} item{items.length > 1 ? "s" : ""})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-brand">Henima</p>
            <p className="cart-empty-msg">Keranjang kamu masih kosong</p>
            <Link href="/shop" className="cart-btn-red">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              <div className="cart-header-row">
                <p>Product</p>
                <p className="center">Qty</p>
                <p className="right">Total</p>
                <p />
              </div>

              {items.map((item) => (
                <div key={item.productId + item.variantId} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-thumb">
                      {item.productPhoto && (
                        <Image
                          src={item.productPhoto}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="cart-item-name-row">
                        <p className="cart-item-name">{item.productName}</p>
                        {item.isFlashSale && (
                          <span className="cart-flash">FLASH SALE</span>
                        )}
                      </div>
                      <p className="cart-item-meta">
                        {item.sizeMl}ml · Extrait de Parfum
                      </p>
                      <div className="cart-item-price-row">
                        <p
                          className={
                            item.isFlashSale ? "cart-price-sale" : "cart-price"
                          }
                        >
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        {item.isFlashSale && item.originalPrice && (
                          <p className="cart-price-was">
                            Rp {item.originalPrice.toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() =>
                        handleQty(item.productId, item.variantId, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQty(item.productId, item.variantId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-line-total">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() => handleRemove(item.productId, item.variantId)}
                    aria-label="Hapus"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="cart-sum-row">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="cart-sum-row muted">
                <span>Ongkir</span>
                <span>Dihitung saat checkout</span>
              </div>
              <div className="cart-sum-rule" />
              <div className="cart-sum-row total">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <Link href="/checkout" className="cart-btn-red block">
                Checkout
              </Link>
              <Link href="/shop" className="cart-btn-outline">
                Lanjut Belanja
              </Link>
            </aside>
          </div>
        )}
      </div>

      <style>{`
        .cart-wrap {
          background: #FFFFFF;
          min-height: 60vh;
          color: #212529;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        }
        .cart-bar {
          padding: 14px 36px;
          border-bottom: 1px solid rgba(33, 37, 41, 0.1);
        }
        .cart-back {
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #868e96;
          text-decoration: none;
          text-transform: uppercase;
        }
        .cart-back:hover { color: #212529; }

        .cart-body {
          max-width: 1140px;
          margin: 0 auto;
          padding: 28px 36px 64px;
        }
        .cart-title {
          margin: 0 0 28px;
          font-size: clamp(24px, 3.2vw, 32px);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #212529;
          line-height: 1.2;
        }
        .cart-count {
          margin-left: 10px;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.04em;
          text-transform: none;
          color: #868e96;
        }

        .cart-empty {
          text-align: center;
          padding: 48px 0 56px;
        }
        .cart-empty-brand {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #868e96;
        }
        .cart-empty-msg {
          margin: 0 0 28px;
          font-size: 16px;
          line-height: 1.6;
          color: #495057;
        }

        .cart-btn-red {
          display: inline-block;
          background: #A30116;
          color: #fff;
          padding: 14px 32px;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: inherit;
          border: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .cart-btn-red:hover { opacity: 0.9; transform: translateY(-1px); }
        .cart-btn-red.block { display: block; text-align: center; width: 100%; box-sizing: border-box; }

        .cart-btn-outline {
          display: block;
          margin-top: 10px;
          padding: 13px;
          text-align: center;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          color: #212529;
          border: 1px solid rgba(33, 37, 41, 0.2);
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;
        }
        .cart-btn-outline:hover { border-color: #212529; }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 40px;
          align-items: start;
        }
        .cart-header-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 16px;
          padding: 0 0 12px;
          border-bottom: 1px solid #212529;
          margin-bottom: 0;
        }
        .cart-header-row p {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #868e96;
        }
        .cart-header-row .center { text-align: center; }
        .cart-header-row .right { text-align: right; }

        .cart-item {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 16px;
          align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid rgba(33, 37, 41, 0.08);
        }
        .cart-item-info { display: flex; gap: 14px; align-items: center; }
        .cart-thumb {
          position: relative;
          width: 64px;
          height: 64px;
          background: #f5f5f4;
          flex-shrink: 0;
          overflow: hidden;
        }
        .cart-item-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .cart-item-name {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          color: #212529;
        }
        .cart-flash {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          background: #FFEBEE;
          color: #A30116;
        }
        .cart-item-meta {
          margin: 0;
          font-size: 12px;
          color: #868e96;
        }
        .cart-item-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }
        .cart-price { margin: 0; font-size: 13px; color: #212529; }
        .cart-price-sale { margin: 0; font-size: 13px; color: #A30116; font-weight: 500; }
        .cart-price-was {
          margin: 0;
          font-size: 12px;
          color: #868e96;
          text-decoration: line-through;
        }

        .cart-qty {
          display: flex;
          align-items: center;
          border: 1px solid rgba(33, 37, 41, 0.15);
        }
        .cart-qty button {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #212529;
          font-family: inherit;
        }
        .cart-qty span {
          width: 32px;
          text-align: center;
          font-size: 13px;
        }
        .cart-line-total {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          color: #212529;
          text-align: right;
          min-width: 100px;
        }
        .cart-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #868e96;
          font-size: 18px;
          padding: 4px;
          line-height: 1;
        }
        .cart-remove:hover { color: #212529; }

        .cart-summary {
          background: #FAFAFA;
          padding: 28px;
          position: sticky;
          top: 100px;
        }
        .cart-summary h2 {
          margin: 0 0 20px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #212529;
        }
        .cart-sum-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #212529;
        }
        .cart-sum-row.muted { color: #868e96; }
        .cart-sum-row.total {
          margin-bottom: 24px;
          font-size: 15px;
          font-weight: 500;
        }
        .cart-sum-rule {
          height: 1px;
          background: rgba(33, 37, 41, 0.1);
          margin: 8px 0 20px;
        }

        @media (max-width: 768px) {
          .cart-bar { padding: 12px 20px; }
          .cart-body { padding: 20px 20px 48px; }
          .cart-empty { padding: 36px 0 44px; }
          .cart-grid { grid-template-columns: 1fr; gap: 28px; }
          .cart-header-row { display: none; }
          .cart-item {
            grid-template-columns: 1fr auto;
            gap: 12px;
          }
          .cart-line-total { grid-column: 1 / -1; text-align: left; min-width: 0; }
          .cart-qty { justify-self: start; }
          .cart-remove { justify-self: end; }
          .cart-summary { position: static; }
        }
      `}</style>
    </div>
  );
}
