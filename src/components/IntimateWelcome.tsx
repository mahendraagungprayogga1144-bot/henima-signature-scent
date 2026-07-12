"use client";

import { useEffect, useState } from "react";

type Props = {
  firstName: string;
  tierLabel: string;
  tierColor: string;
  tierBg: string;
  totalPoints: number;
  progressPct: number;
  pointsNeeded: number;
  nextLabel: string | null;
  benefits: string[];
};

export default function IntimateWelcome({
  firstName,
  tierLabel,
  tierColor,
  tierBg,
  totalPoints,
  progressPct,
  pointsNeeded,
  nextLabel,
  benefits,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className={`intimate-welcome ${ready ? "is-ready" : ""}`}>
      <div className="intimate-hero">
        <div className="intimate-glow intimate-glow-a" aria-hidden />
        <div className="intimate-glow intimate-glow-b" aria-hidden />

        <div className="intimate-hero-inner">
          <div className="intimate-avatar-wrap">
            <div className="intimate-avatar-ring" style={{ borderColor: tierColor + "55" }} />
            <div className="intimate-avatar">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B5935A" strokeWidth="1.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="intimate-heart" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={tierColor} opacity="0.85">
                <path d="M12 21s-7-4.5-9.5-8.2C.5 9.5 2.2 6 5.5 6c1.9 0 3.2 1.1 3.9 2.2C10.1 7.1 11.4 6 13.3 6c3.3 0 5 3.5 3 6.8C19 16.5 12 21 12 21z" />
              </svg>
            </span>
          </div>

          <div className="intimate-copy">
            <p className="intimate-eyebrow">The Intimate</p>
            <p className="intimate-story">
              Dua kota. Satu rindu. Satu wewangian yang menghubungkan.
            </p>
            <h1 className="intimate-title">
              Holla, selamat datang{" "}
              <em style={{ fontStyle: "italic", color: tierColor }}>{firstName}</em>
            </h1>
            <p className="intimate-lead">
              Kamu sudah menjadi bagian dari cerita Henima. Setiap belanja yang sampai
              menambah poinmu — <strong>Rp 10.000 = 1 poin</strong>. Semakin dekat kita,
              semakin istimewa kehadiranmu di sini.
            </p>

            <div className="intimate-badges">
              <div className="intimate-badge" style={{ borderColor: tierColor }}>
                <span className="intimate-dot" style={{ background: tierColor }} />
                <span style={{ color: tierColor }}>{tierLabel}</span>
              </div>
              <div
                className="intimate-badge intimate-badge-fill"
                style={{ background: tierBg, borderColor: tierColor + "55" }}
              >
                <span className="intimate-badge-muted">Poin</span>
                <span style={{ color: tierColor, fontWeight: 700, fontSize: "16px" }}>
                  {totalPoints.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {nextLabel && (
        <div className="intimate-progress-wrap">
          <div className="intimate-progress-card">
            <div className="intimate-progress-head">
              <span>Progress ke {nextLabel}</span>
              <span style={{ color: tierColor, fontWeight: 700 }}>{progressPct}%</span>
            </div>
            <div className="intimate-progress-track">
              <div
                className="intimate-progress-fill"
                style={{
                  width: ready ? `${progressPct}%` : "0%",
                  background: `linear-gradient(90deg, ${tierColor}, #DAA520)`,
                }}
              />
            </div>
            <p className="intimate-progress-note">
              Butuh {pointsNeeded.toLocaleString("id-ID")} poin lagi untuk naik ke {nextLabel}
            </p>
          </div>
        </div>
      )}

      <div className="intimate-benefit-wrap">
        <div className="intimate-benefit-card" style={{ background: tierBg, borderColor: tierColor + "44" }}>
          <p className="intimate-benefit-label" style={{ color: tierColor }}>
            Benefit {tierLabel} saat ini
          </p>
          <div className="intimate-benefit-list">
            {benefits.map((b, i) => (
              <div
                key={b}
                className="intimate-benefit-item"
                style={{ animationDelay: `${0.55 + i * 0.12}s` }}
              >
                <div className="intimate-check" style={{ background: tierColor }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .intimate-welcome { position: relative; overflow: hidden; }

        .intimate-hero {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
          padding: 72px 32px 48px;
        }
        .intimate-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0;
        }
        .intimate-glow-a {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(201,169,110,0.28), transparent 70%);
          top: -40px; right: 8%;
        }
        .intimate-glow-b {
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(184,134,11,0.16), transparent 70%);
          bottom: 0; left: 4%;
        }
        .is-ready .intimate-glow-a {
          animation: intimateGlow 5s ease-in-out infinite;
          opacity: 1;
        }
        .is-ready .intimate-glow-b {
          animation: intimateGlow 6.5s ease-in-out infinite 0.8s;
          opacity: 1;
        }

        .intimate-hero-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          gap: 48px;
          flex-wrap: wrap;
        }

        .intimate-avatar-wrap {
          position: relative;
          width: 128px;
          height: 128px;
          flex-shrink: 0;
          opacity: 0;
          transform: scale(0.92);
        }
        .is-ready .intimate-avatar-wrap {
          animation: intimateRise 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .intimate-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #EDE8E0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #D5CFC8;
          position: relative;
          z-index: 1;
        }
        .intimate-avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid transparent;
          opacity: 0;
        }
        .is-ready .intimate-avatar-ring {
          animation: intimatePulse 3.2s ease-in-out infinite 0.6s;
        }
        .intimate-heart {
          position: absolute;
          right: -2px;
          bottom: 10px;
          z-index: 2;
          opacity: 0;
          transform: scale(0.6);
        }
        .is-ready .intimate-heart {
          animation: intimateHeart 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards,
                     intimateFloat 3.4s ease-in-out 1.5s infinite;
        }

        .intimate-copy { flex: 1; min-width: 280px; }
        .intimate-eyebrow,
        .intimate-story,
        .intimate-title,
        .intimate-lead,
        .intimate-badges {
          opacity: 0;
          transform: translateY(18px);
        }
        .is-ready .intimate-eyebrow {
          animation: intimateRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .is-ready .intimate-story {
          animation: intimateRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.28s forwards;
        }
        .is-ready .intimate-title {
          animation: intimateRise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        .is-ready .intimate-lead {
          animation: intimateRise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.52s forwards;
        }
        .is-ready .intimate-badges {
          animation: intimateRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.64s forwards;
        }

        .intimate-eyebrow {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #B5935A;
          margin-bottom: 14px;
          font-weight: 600;
        }
        .intimate-story {
          font-family: var(--font-cormorant);
          font-size: clamp(15px, 2vw, 18px);
          font-style: italic;
          color: #9A8F82;
          margin: 0 0 14px;
          line-height: 1.5;
        }
        .intimate-title {
          font-family: var(--font-cormorant);
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 400;
          color: #1C1917;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .intimate-lead {
          font-size: 14px;
          color: #6B5E52;
          line-height: 1.9;
          max-width: 580px;
          margin: 0 0 22px;
        }
        .intimate-lead strong { color: #1C1917; font-weight: 600; }

        .intimate-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .intimate-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 10px 20px;
          border: 1px solid;
          border-radius: 2px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
        }
        .intimate-badge-fill { gap: 8px; }
        .intimate-badge-muted {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9E8E7E;
          font-weight: 500;
        }
        .intimate-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .intimate-progress-wrap,
        .intimate-benefit-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 32px 40px;
          opacity: 0;
          transform: translateY(20px);
        }
        .is-ready .intimate-progress-wrap {
          animation: intimateRise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
        }
        .is-ready .intimate-benefit-wrap {
          animation: intimateRise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
        }
        .intimate-progress-card,
        .intimate-benefit-card {
          background: #fff;
          padding: 28px 32px;
          border: 1px solid #E8E0D5;
        }
        .intimate-progress-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 11px;
          color: #9E8E7E;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .intimate-progress-track {
          height: 4px;
          background: #EDE8E0;
          border-radius: 2px;
          overflow: hidden;
        }
        .intimate-progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1.6s cubic-bezier(0.16, 1, 0.3, 1) 1s;
        }
        .intimate-progress-note {
          font-size: 12px;
          color: #B5A898;
          margin-top: 10px;
        }

        .intimate-benefit-label {
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .intimate-benefit-list { display: grid; gap: 12px; }
        .intimate-benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          opacity: 0;
          transform: translateX(-10px);
        }
        .is-ready .intimate-benefit-item {
          animation: intimateSlide 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .intimate-benefit-item p {
          font-size: 14px;
          color: #4A3F35;
          line-height: 1.6;
          margin: 0;
        }
        .intimate-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        @keyframes intimateRise {
          to { opacity: 1; transform: none; }
        }
        @keyframes intimateSlide {
          to { opacity: 1; transform: none; }
        }
        @keyframes intimateFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes intimateHeart {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes intimatePulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes intimateGlow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(-12px, 10px) scale(1.08); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .intimate-welcome *,
          .intimate-welcome *::before {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .intimate-progress-fill { width: var(--pct, 0%) !important; }
        }

        @media (max-width: 640px) {
          .intimate-hero { padding: 48px 24px 32px; }
          .intimate-progress-wrap,
          .intimate-benefit-wrap { padding: 0 24px 32px; }
          .intimate-progress-card,
          .intimate-benefit-card { padding: 22px 20px; }
        }
      `}</style>
    </div>
  );
}
