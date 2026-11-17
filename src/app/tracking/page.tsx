"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS_STEPS = ["pending_payment", "paid", "processing", "shipped", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Bayar",
  paid: "Sudah Bayar",
  processing: "Dikemas",
  shipped: "Dikirim",
  delivered: "Selesai",
};
const STATUS_COLORS: Record<string, string> = {
  pending_payment: "#868e96",
  paid: "#495057",
  processing: "#A30116",
  shipped: "#2f9e44",
  delivered: "#2b8a3e",
};

/** Track Order — panel rapat, Futura, CTA merah (bukan form mengambang) */
export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [notifSent, setNotifSent] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  async function search() {
    if (!orderId.trim()) return;
    if (!phone.trim()) {
      setError("Masukkan nomor WhatsApp yang dipakai saat checkout.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    setTracking(null);
    setReviewSubmitted(false);
    try {
      const qs = new URLSearchParams({ phone: phone.trim() });
      const res = await fetch(
        "/api/orders/" + encodeURIComponent(orderId.trim()) + "?" + qs.toString()
      );
      if (res.status === 401) {
        setError("Nomor WhatsApp tidak cocok dengan pesanan ini.");
        return;
      }
      if (!res.ok) {
        setError("Order tidak ditemukan. Pastikan Order ID benar.");
        return;
      }
      const data = await res.json();
      setOrder(data);
      if (data.resi) {
        const tr = await fetch(
          "/api/tracking?resi=" +
            data.resi +
            (data.courier_code || data.courier
              ? "&courier=" + (data.courier_code || data.courier)
              : "")
        );
        if (tr.ok) setTracking(await tr.json());
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function copyResi() {
    if (order?.resi) {
      navigator.clipboard.writeText(order.resi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function submitReview() {
    if (!reviewRating || !reviewText.trim()) return;
    setReviewLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          customer_name: order.customer?.name,
          customer_email: order.customer?.email,
          rating: reviewRating,
          review: reviewText,
          product_id: order.items?.[0]?.productId || "",
          product_name: order.items?.[0]?.productName || "",
        }),
      });
      setReviewSubmitted(true);
    } catch {
    } finally {
      setReviewLoading(false);
    }
  }

  const currentIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const etaDate = order?.created_at
    ? new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;
  const daysLeft = etaDate
    ? Math.max(0, Math.ceil((etaDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="tr-wrap">
      <div className="tr-shell">
        {/* Left brand strip — desktop */}
        <aside className="tr-aside">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/layout/chapter-distance.jpg" alt="" className="tr-aside-img" />
          <div className="tr-aside-shade" />
          <div className="tr-aside-copy">
            <p className="tr-aside-eyebrow">Henima Signature Scent</p>
            <h2 className="tr-aside-title">
              Track.
              <br />
              Stay close.
            </h2>
          </div>
        </aside>

        {/* Form / results — logo + Futura seperti /masuk */}
        <section className="tr-main">
          <div className="tr-main-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/henima-logo-tight.png" alt="Henima" className="tr-logo" />
            <p className="tr-eyebrow">Tracking</p>
            <h1 className="tr-title">Track Your Order</h1>
            <p className="tr-sub">
              Masukkan Order ID dan nomor WhatsApp yang dipakai saat checkout.
            </p>

            <div className="tr-form">
              <label className="tr-label" htmlFor="tr-order">
                Order ID
              </label>
              <input
                id="tr-order"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="ORD-1234567890-ABCD"
                className="tr-input"
              />

              <label className="tr-label" htmlFor="tr-phone">
                WhatsApp checkout
              </label>
              <input
                id="tr-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="08xxxxxxxxxx"
                className="tr-input"
              />

              <div className="tr-actions">
                <button type="button" onClick={search} disabled={loading} className="tr-btn">
                  {loading ? "..." : "Track Order"}
                </button>
              </div>
            </div>

            {error && <div className="tr-error">{error}</div>}

            {order && (
              <div className="tr-result">
                {order.status === "shipped" && etaDate && (
                  <div className="tr-eta">
                    <div>
                      <p className="tr-label-light">Estimasi tiba</p>
                      <p className="tr-eta-date">
                        {etaDate.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="tr-eta-courier">{order.courier_name}</p>
                    </div>
                    {daysLeft !== null && (
                      <div className="tr-eta-days">
                        <p className="tr-eta-num">{daysLeft}</p>
                        <p className="tr-label-light">Hari</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="tr-order-head">
                  <div>
                    <p className="tr-meta">Order ID</p>
                    <p className="tr-order-id">{order.id}</p>
                  </div>
                  <div
                    className="tr-badge"
                    style={{ background: STATUS_COLORS[order.status] || "#868e96" }}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </div>
                </div>

                {order.resi && (
                  <div className="tr-resi">
                    <div>
                      <p className="tr-resi-name">{order.courier_name}</p>
                      <p className="tr-meta">Sidoarjo, Jawa Timur</p>
                    </div>
                    <div className="tr-resi-right">
                      <div>
                        <p className="tr-meta">Resi</p>
                        <p className="tr-resi-code">{order.resi}</p>
                      </div>
                      <button type="button" onClick={copyResi} className="tr-btn-ghost">
                        {copied ? "Disalin" : "Salin"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="tr-steps">
                  <div className="tr-steps-line" />
                  <div
                    className="tr-steps-progress"
                    style={{
                      width: currentIndex >= 0 ? `${(currentIndex / 4) * 80}%` : "0%",
                    }}
                  />
                  {STATUS_STEPS.map((step, i) => {
                    const isPast = i <= currentIndex;
                    return (
                      <div key={step} className="tr-step">
                        <div className={`tr-step-dot ${isPast ? "on" : ""}`}>
                          {isPast && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="#fff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <p className={isPast ? "on" : ""}>{STATUS_LABELS[step]}</p>
                      </div>
                    );
                  })}
                </div>

                {tracking?.history?.length > 0 && (
                  <div className="tr-block">
                    <p className="tr-section">Perjalanan paket</p>
                    <div className="tr-timeline">
                      {tracking.history.map((h: any, i: number) => (
                        <div key={i} className={`tr-tl-item ${i === 0 ? "first" : ""}`}>
                          <p className="tr-tl-date">
                            {h.updated_at
                              ? new Date(h.updated_at).toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                          <p className="tr-tl-note">{h.note || h.status}</p>
                          {h.location && <p className="tr-tl-loc">{h.location}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.status === "shipped" && (
                  <div className="tr-notif">
                    <div>
                      <p className="tr-notif-title">Update otomatis via WA?</p>
                      <p className="tr-meta">Kami kabari tiap kali paket bergerak.</p>
                    </div>
                    <a
                      href={
                        "https://wa.me/6285190311230?text=" +
                        encodeURIComponent(
                          "Halo Henima, aktifkan notifikasi tracking untuk " + order.id
                        )
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setNotifSent(true)}
                      className="tr-btn-ghost"
                    >
                      {notifSent ? "Terkirim" : "Aktifkan"}
                    </a>
                  </div>
                )}

                <p className="tr-section">Dikirim ke</p>
                <div className="tr-card">
                  <p className="tr-card-name">{order.customer?.name}</p>
                  <p className="tr-card-text">
                    {order.customer?.address}, {order.customer?.city},{" "}
                    {order.customer?.province} {order.customer?.postalCode}
                  </p>
                  <p className="tr-meta" style={{ marginTop: 6 }}>
                    {order.customer?.phone}
                  </p>
                </div>

                <p className="tr-section">Rincian</p>
                <div className="tr-items">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="tr-item-row">
                      <span>
                        {item.productName} {item.sizeMl}ml × {item.quantity}
                      </span>
                      <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                  <div className="tr-item-row muted">
                    <span>Ongkir ({order.courier_name})</span>
                    <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="tr-item-row total">
                    <span>Total</span>
                    <span>Rp {order.total?.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {order.status === "delivered" && (
                  <div className="tr-block">
                    <p className="tr-section">Ulasan</p>
                    {reviewSubmitted ? (
                      <div className="tr-review-done">
                        <p className="tr-card-name">Terima kasih atas ulasanmu!</p>
                      </div>
                    ) : (
                      <div className="tr-review">
                        <p className="tr-review-q">Bagaimana pengalamanmu?</p>
                        <div className="tr-stars">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setReviewRating(n)}
                              className={n <= reviewRating ? "on" : ""}
                              aria-label={`${n} bintang`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Ceritakan pengalamanmu..."
                          rows={3}
                          className="tr-textarea"
                        />
                        <button
                          type="button"
                          onClick={submitReview}
                          disabled={reviewLoading || !reviewRating || !reviewText.trim()}
                          className="tr-btn"
                          style={{
                            opacity: reviewRating && reviewText.trim() ? 1 : 0.5,
                          }}
                        >
                          {reviewLoading ? "Mengirim..." : "Kirim Ulasan"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <a
                  className="tr-wa"
                  href={
                    "https://wa.me/6285190311230?text=" +
                    encodeURIComponent("Halo Henima, saya ingin menanyakan pesanan " + order.id)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat WhatsApp
                </a>
              </div>
            )}

            {!order && (
              <p className="tr-hint">
                Butuh bantuan? <Link href="/faq">FAQ</Link>
                {" · "}
                <Link href="/shop">Kembali belanja</Link>
              </p>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .tr-wrap,
        .tr-wrap input,
        .tr-wrap button,
        .tr-wrap textarea,
        .tr-wrap a,
        .tr-wrap p,
        .tr-wrap h1,
        .tr-wrap h2,
        .tr-wrap label,
        .tr-wrap span {
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, "Century Gothic", sans-serif !important;
        }
        .tr-wrap {
          background: #fff;
          color: #212529;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          padding-top: 28px;
        }
        .tr-shell {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          min-height: calc(100vh - 140px);
          gap: 0 28px;
          padding: 0 28px 28px;
          box-sizing: border-box;
        }
        .tr-aside {
          position: relative;
          background: #111;
          overflow: hidden;
          min-height: 100%;
        }
        .tr-aside-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tr-aside-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 100%);
        }
        .tr-aside-copy {
          position: absolute;
          left: 48px;
          right: 48px;
          bottom: 48px;
          z-index: 1;
          color: #fff;
        }
        .tr-aside-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
        }
        .tr-aside-title {
          margin: 0;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.2;
          color: #fff;
        }

        .tr-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          background: #fff;
        }
        .tr-main-inner {
          width: 100%;
          max-width: 400px;
        }
        .tr-logo {
          display: block;
          width: 148px;
          height: auto;
          margin: 0 0 36px;
        }
        .tr-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #868e96;
          font-weight: 400;
        }
        .tr-title {
          margin: 0 0 10px;
          font-size: clamp(26px, 3.2vw, 34px);
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #212529;
          line-height: 1.2;
          text-transform: none;
        }
        .tr-sub {
          margin: 0 0 32px;
          font-size: 15px;
          line-height: 1.7;
          color: #495057;
        }

        .tr-form { margin-bottom: 8px; }
        .tr-label {
          display: block;
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #868e96;
          font-weight: 400;
        }
        .tr-input {
          display: block;
          width: 100%;
          border: none;
          border-bottom: 1px solid rgba(33,37,41,0.18);
          padding: 10px 0;
          margin: 0 0 24px;
          font-size: 15px;
          color: #212529;
          background: transparent;
          outline: none;
          box-sizing: border-box;
        }
        .tr-input:focus { border-bottom-color: #212529; }
        .tr-input::placeholder { color: #adb5bd; }

        .tr-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }
        .tr-btn {
          display: inline-block;
          width: auto;
          margin-top: 0;
          background: #A30116;
          color: #fff;
          border: none;
          padding: 10px 18px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 400;
          transition: opacity 0.2s;
        }
        .tr-btn:hover { opacity: 0.9; }
        .tr-btn:disabled { opacity: 0.6; cursor: wait; }

        .tr-btn-ghost {
          background: #212121;
          color: #fff;
          border: none;
          padding: 8px 14px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
        }

        .tr-error {
          background: #fff5f5;
          border: 1px solid #ffc5c5;
          padding: 12px 14px;
          font-size: 13px;
          color: #A30116;
          margin: 18px 0 0;
        }
        .tr-hint {
          margin: 28px 0 0;
          font-size: 13px;
          color: #868e96;
        }
        .tr-hint a {
          color: #212529;
          text-decoration: none;
          border-bottom: 1px solid rgba(33,37,41,0.25);
        }

        .tr-result { margin-top: 36px; padding-top: 28px; border-top: 1px solid rgba(33,37,41,0.1); }

        .tr-eta {
          background: #111;
          padding: 18px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          color: #fff;
        }
        .tr-label-light {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .tr-eta-date { margin: 6px 0 0; font-size: 16px; color: #f5f5f4; }
        .tr-eta-courier { margin: 4px 0 0; font-size: 11px; color: rgba(255,255,255,0.4); }
        .tr-eta-days {
          border: 1px solid rgba(255,255,255,0.22);
          padding: 10px 14px;
          text-align: center;
        }
        .tr-eta-num { margin: 0; font-size: 24px; line-height: 1; }

        .tr-order-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }
        .tr-meta {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #868e96;
        }
        .tr-order-id { margin: 4px 0 0; font-size: 14px; font-weight: 500; }
        .tr-badge {
          color: #fff;
          padding: 5px 12px;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .tr-resi {
          background: #FAFAFA;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tr-resi-name { margin: 0 0 4px; font-size: 14px; font-weight: 500; }
        .tr-resi-right { display: flex; align-items: center; gap: 10px; }
        .tr-resi-code {
          margin: 3px 0 0;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .tr-steps {
          position: relative;
          display: flex;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .tr-steps-line {
          position: absolute;
          top: 12px;
          left: 8%;
          right: 8%;
          height: 2px;
          background: #dee2e6;
        }
        .tr-steps-progress {
          position: absolute;
          top: 12px;
          left: 8%;
          height: 2px;
          background: #212121;
          transition: width 0.45s ease;
        }
        .tr-step {
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .tr-step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tr-step-dot.on { background: #212121; }
        .tr-step p {
          margin: 0;
          font-size: 8px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #868e96;
          text-align: center;
          max-width: 52px;
          line-height: 1.25;
        }
        .tr-step p.on { color: #212529; font-weight: 500; }

        .tr-block { margin-bottom: 22px; }
        .tr-section {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #868e96;
          font-weight: 500;
        }
        .tr-timeline { position: relative; padding-left: 18px; }
        .tr-timeline::before {
          content: "";
          position: absolute;
          left: 3px;
          top: 4px;
          bottom: 4px;
          width: 1px;
          background: #dee2e6;
        }
        .tr-tl-item { position: relative; margin-bottom: 16px; }
        .tr-tl-item::before {
          content: "";
          position: absolute;
          left: -18px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #dee2e6;
          border: 2px solid #fff;
        }
        .tr-tl-item.first::before { background: #212121; }
        .tr-tl-date { margin: 0 0 2px; font-size: 11px; color: #868e96; }
        .tr-tl-item.first .tr-tl-date { color: #212529; font-weight: 500; }
        .tr-tl-note { margin: 0; font-size: 13px; line-height: 1.55; color: #495057; }
        .tr-tl-item.first .tr-tl-note { color: #212529; font-weight: 500; }
        .tr-tl-loc { margin: 3px 0 0; font-size: 11px; color: #868e96; }

        .tr-notif {
          border: 1px solid rgba(33,37,41,0.1);
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tr-notif-title { margin: 0 0 3px; font-size: 13px; font-weight: 500; }

        .tr-card {
          background: #FAFAFA;
          padding: 14px 16px;
          margin-bottom: 22px;
        }
        .tr-card-name { margin: 0 0 4px; font-size: 14px; font-weight: 500; }
        .tr-card-text { margin: 0; font-size: 13px; line-height: 1.65; color: #495057; }

        .tr-items {
          border: 1px solid rgba(33,37,41,0.1);
          margin-bottom: 22px;
        }
        .tr-item-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 14px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 13px;
        }
        .tr-item-row.muted { color: #868e96; }
        .tr-item-row.total {
          background: #FAFAFA;
          font-weight: 500;
          border-bottom: none;
        }

        .tr-review, .tr-review-done {
          border: 1px solid rgba(33,37,41,0.1);
          padding: 22px;
          text-align: center;
        }
        .tr-review-done { background: #FAFAFA; border: none; }
        .tr-review-q { margin: 0 0 12px; font-size: 16px; }
        .tr-stars { display: flex; justify-content: center; gap: 6px; margin-bottom: 14px; }
        .tr-stars button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #dee2e6;
          padding: 0;
          line-height: 1;
        }
        .tr-stars button.on { color: #A30116; }
        .tr-textarea {
          width: 100%;
          border: 1px solid rgba(33,37,41,0.18);
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          resize: vertical;
          margin-bottom: 12px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .tr-wa {
          display: block;
          text-align: center;
          background: #111;
          color: #fff;
          padding: 14px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .tr-wrap { padding-top: 20px; }
          .tr-shell {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 0;
            padding: 0 16px 24px;
          }
          .tr-aside { min-height: 32vh; }
          .tr-aside-copy { left: 24px; right: 24px; bottom: 24px; }
          .tr-main {
            align-items: flex-start;
            padding: 36px 20px 56px;
          }
          .tr-logo { width: 128px; margin-bottom: 28px; }
        }
      `}</style>
    </div>
  );
}
