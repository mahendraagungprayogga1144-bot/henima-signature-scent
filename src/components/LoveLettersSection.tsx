"use client";
import { useEffect, useState, useRef } from "react";
import { supabaseAnon } from "@/lib/supabase";

type Story = {
  id: string;
  name: string;
  city: string;
  story: string;
  perfume: string;
  admin_reply?: string;
  avatar_url?: string;
};

export default function LoveLettersSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    supabaseAnon
      .from("love_stories")
      .select("id,name,city,story,perfume,admin_reply,avatar_url")
      .eq("status", "approved")
      .eq("show_on_homepage", true)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setStories(data || []))
      .catch(() => setStories([]));
  }, []);

  const scroll = (dir: number) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  if (!stories.length) return null;

  return (
    <section style={{ background: "#111111", padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ padding: "0 8vw", marginBottom: "48px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px", fontFamily: "var(--font-jakarta)", fontWeight: 400 }}>
            Love Letters
          </p>
          <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
            Mereka sudah<br />merasakannya.
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#FFFFFF", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#FFFFFF", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            →
          </button>
          <a
            href="/love-letters"
            style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", textDecoration: "none", fontFamily: "var(--font-jakarta)", marginLeft: "8px", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "2px" }}
          >
            Lihat Semua
          </a>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{ display: "flex", gap: "1px", overflowX: "auto", scrollbarWidth: "none", paddingLeft: "8vw", paddingRight: "8vw", scrollSnapType: "x mandatory" }}
        className="ll-track"
      >
        {stories.map((s) => (
          <div
            key={s.id}
            style={{ flexShrink: 0, width: "320px", background: "#1A1A1A", padding: "36px 32px", scrollSnapAlign: "start", borderRight: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>★</span>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-jakarta)", fontStyle: "italic", fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.9)", fontWeight: 300, marginBottom: "28px", minHeight: "120px" }}>
              “{s.story}”
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              {s.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.avatar_url} alt={s.name} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontSize: "14px", color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontFamily: "var(--font-jakarta)", fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.85)", marginBottom: "2px" }}>{s.name}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", fontWeight: 300 }}>
                  {s.city}
                  {s.perfume && s.perfume !== "Belum punya Henima" ? ` — ${s.perfume}` : ""}
                </p>
              </div>
            </div>
            {s.admin_reply && (
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontFamily: "var(--font-jakarta)" }}>Henima</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "var(--font-jakarta)" }}>“{s.admin_reply}”</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "0 8vw", marginTop: "56px", textAlign: "center" }}>
        <a
          href="/share-story"
          style={{
            display: "inline-block",
            padding: "14px 48px",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#FFFFFF",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "var(--font-jakarta)",
            fontWeight: 400,
          }}
        >
          Bagikan Kisahmu
        </a>
      </div>
      <style>{`.ll-track::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}
