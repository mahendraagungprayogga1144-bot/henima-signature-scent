"use client";
import { useEffect, useState } from "react";

/**
 * Kenzo Create a connection — floating modal.
 * Buka hanya saat scroll ke Our Stores / pita hitam (bukan pas pertama buka).
 * Border hitam 5px nyatu visual dengan pita hitam + footer di belakangnya.
 */
export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    let opened = false;
    const openOnce = () => {
      if (opened) return;
      opened = true;
      setOpen(true);
    };

    const target =
      document.getElementById("henima-nl-band") ||
      document.getElementById("henima-stores");
    if (!target) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          openOnce();
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  async function submit() {
    if (!email.trim() || !checked) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Subscriber" }),
      });
      if (res.ok) {
        setStatus("ok");
      } else setStatus("err");
    } catch {
      setStatus("err");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="henima-nl-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        pointerEvents: "none",
      }}
    >
      {/* tanpa dim gelap — biar pita hitam + footer terbaca, border modal nyatu */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          pointerEvents: "auto",
        }}
        onClick={() => setOpen(false)}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          background: "#FFFFFF",
          border: "5px solid #000000",
          padding: "48px 44px 40px",
          boxSizing: "border-box",
          fontFamily: "var(--font-jakarta)",
          pointerEvents: "auto",
        }}
      >
        <h2
          id="henima-nl-title"
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(26px, 3vw, 32px)",
            fontWeight: 600,
            color: "#000",
            letterSpacing: "-0.02em",
          }}
        >
          Create a connection
        </h2>

        <p
          style={{
            margin: "0 0 26px",
            fontSize: 14,
            lineHeight: 1.55,
            color: "#222",
            fontWeight: 300,
            maxWidth: 400,
          }}
        >
          Subscribe to our newsletter, share the good news, and create a more beautiful world together.
        </p>

        {status === "ok" ? (
          <p style={{ fontSize: 14, color: "#1a7f37", margin: 0 }}>
            Thank you for subscribing to our newsletter!
          </p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "stretch", marginBottom: 16, maxWidth: 380 }}>
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
                  padding: "15px 16px",
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
                marginBottom: 16,
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

            {status === "err" && <p style={{ fontSize: 12, color: "#c00", marginBottom: 8 }}>Try again.</p>}

            <p style={{ margin: 0, fontSize: 11, color: "#666", lineHeight: 1.55, maxWidth: 420 }}>
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
  );
}
