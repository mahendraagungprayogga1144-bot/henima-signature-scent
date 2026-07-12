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
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setProgressWidth(progressPct), 400);
    return () => window.clearTimeout(id);
  }, [progressPct]);

  return (
    <div className="intimate-welcome">
      <div className="intimate-hero">
        <div className="intimate-glow intimate-glow-a" aria-hidden />
        <div className="intimate-glow intimate-glow-b" aria-hidden />

        <div className="intimate-hero-inner">
          <div className="intimate-avatar-wrap intimate-anim" style={{ animationDelay: "0s" }}>
            <div className="intimate-avatar-ring" style={{ borderColor: tierColor + "66" }} />
            <div className="intimate-avatar">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B5935A" strokeWidth="1.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="intimate-heart" aria-hidden style={{ color: tierColor }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.5-9.5-8.2C.5 9.5 2.2 6 5.5 6c1.9 0 3.2 1.1 3.9 2.2C10.1 7.1 11.4 6 13.3 6c3.3 0 5 3.5 3 6.8C19 16.5 12 21 12 21z" />
              </svg>
            </span>
          </div>

          <div className="intimate-copy">
            <p className="intimate-eyebrow intimate-anim" style={{ animationDelay: "0.12s" }}>
              The Intimate
            </p>
            <p className="intimate-story intimate-anim" style={{ animationDelay: "0.28s" }}>
              Dua kota. Satu rindu. Satu wewangian yang menghubungkan.
            </p>
            <h1 className="intimate-title intimate-anim" style={{ animationDelay: "0.42s" }}>
              Holla, selamat datang{" "}
              <em style={{ fontStyle: "italic", color: tierColor }}>{firstName}</em>
            </h1>
            <p className="intimate-lead intimate-anim" style={{ animationDelay: "0.58s" }}>
              Kamu sudah menjadi bagian dari cerita Henima. Setiap belanja yang sampai
              menambah poinmu — <strong>Rp 10.000 = 1 poin</strong>. Semakin dekat kita,
              semakin istimewa kehadiranmu di sini.
            </p>

            <div className="intimate-badges intimate-anim" style={{ animationDelay: "0.72s" }}>
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
        <div className="intimate-progress-wrap intimate-anim" style={{ animationDelay: "0.85s" }}>
          <div className="intimate-progress-card">
            <div className="intimate-progress-head">
              <span>Progress ke {nextLabel}</span>
              <span style={{ color: tierColor, fontWeight: 700 }}>{progressPct}%</span>
            </div>
            <div className="intimate-progress-track">
              <div
                className="intimate-progress-fill"
                style={{
                  width: `${progressWidth}%`,
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

      <div className="intimate-benefit-wrap intimate-anim" style={{ animationDelay: "1s" }}>
        <div className="intimate-benefit-card" style={{ background: tierBg, borderColor: tierColor + "44" }}>
          <p className="intimate-benefit-label" style={{ color: tierColor }}>
            Benefit {tierLabel} saat ini
          </p>
          <div className="intimate-benefit-list">
            {benefits.map((b, i) => (
              <div
                key={b}
                className="intimate-benefit-item intimate-anim"
                style={{ animationDelay: `${1.1 + i * 0.12}s` }}
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
    </div>
  );
}
