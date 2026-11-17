"use client";
import { useState } from "react";

/**
 * Kenzo newsletter (garis merah):
 * [BLACK] [WHITE CARD] [BLACK]
 * Satu strip #222 full-width di belakang card; terlihat hanya kiri & kanan.
 * Mulai ~45% tinggi card, tinggi ~185px desktop, berakhir sebelum bawah card.
 */
export default function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit() {
    if (!email.trim() || !checked) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Subscriber" }),
      });
      if (res.ok) setStatus("ok");
      else setStatus("err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section
      id="henima-nl-band"
      style={{
        position: "relative",
        background: "#FFFFFF",
        paddingTop: 72,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Wrapper = tinggi card → top:45% relatif ke card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        {/* Background hitam horizontal full viewport — di BELAKANG card */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "100vw",
            height: 185,
            background: "#222222",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Newsletter card putih — z lebih tinggi, menutup tengah strip */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            background: "#FFFFFF",
            border: "15px solid #212121",
            padding: "36px 48px 32px",
            boxSizing: "border-box",
            fontFamily: "var(--font-jakarta)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(24px, 3vw, 30px)",
              fontWeight: 600,
              color: "#000",
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            Create a connection
          </h2>

          <p
            style={{
              margin: "0 0 22px",
              fontSize: 14,
              lineHeight: 1.55,
              color: "#222",
              fontWeight: 300,
              textAlign: "center",
            }}
          >
            Subscribe to our newsletter, share the good news, and create a more beautiful world together.
          </p>

          {status === "ok" ? (
            <p style={{ fontSize: 14, color: "#1a7f37", margin: 0, textAlign: "center" }}>
              Thank you for subscribing to our newsletter!
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  marginBottom: 14,
                  maxWidth: 480,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "#C8C8C8",
                    padding: "14px 16px",
                    fontSize: 14,
                    color: "#fff",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "loading" || !email.trim() || !checked}
                  aria-label="Subscribe"
                  style={{
                    width: 48,
                    flexShrink: 0,
                    background: "#00C4D6",
                    border: "none",
                    color: "#fff",
                    fontSize: 18,
                    cursor: "pointer",
                    opacity: !email.trim() || !checked ? 0.5 : 1,
                  }}
                >
                  →
                </button>
              </div>

              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  fontSize: 13,
                  color: "#111",
                  cursor: "pointer",
                  marginBottom: 14,
                  maxWidth: 480,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  style={{ marginTop: 2, width: 14, height: 14, flexShrink: 0 }}
                />
                <span>I want to subscribe to Henima newsletter.</span>
              </label>

              {status === "err" && (
                <p style={{ fontSize: 12, color: "#c00", marginBottom: 8, textAlign: "center" }}>Try again.</p>
              )}

              <p
                style={{
                  margin: "0 auto",
                  fontSize: 11,
                  color: "#666",
                  lineHeight: 1.55,
                  maxWidth: 520,
                  textAlign: "center",
                }}
              >
                For information on how your personal data is processed and to know your rights, please consult
                our{" "}
                <a href="/syarat-ketentuan" style={{ color: "#111", textDecoration: "underline" }}>
                  Data Protection Policy
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
