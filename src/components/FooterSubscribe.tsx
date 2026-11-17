"use client";
import { useState } from "react";

/** Kenzo footer newsletter — input + checkbox + privacy text */
export default function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function subscribe() {
    if (!email.trim() || !checked) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Subscriber" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: "#FFFFFF", marginBottom: 14, fontWeight: 500 }}>
        Subscribe to our newsletter
      </p>
      {status === "success" ? (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Thank you.</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "stretch", maxWidth: 260, marginBottom: 14 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              onKeyDown={(e) => e.key === "Enter" && subscribe()}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.55)",
                borderRight: "none",
                padding: "12px 14px",
                fontSize: 12,
                color: "#FFFFFF",
                fontFamily: "var(--font-jakarta)",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={subscribe}
              disabled={status === "loading" || !email.trim() || !checked}
              aria-label="Subscribe"
              style={{
                width: 42,
                background: "#8A8A8A",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: 16,
                opacity: !email.trim() || !checked ? 0.55 : 1,
              }}
            >
              →
            </button>
          </div>

          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              fontSize: 11,
              color: "rgba(255,255,255,0.65)",
              cursor: "pointer",
              marginBottom: 12,
              maxWidth: 280,
              lineHeight: 1.4,
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span>I want to subscribe to Henima newsletter.</span>
          </label>

          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.5,
              maxWidth: 280,
            }}
          >
            Henima is the processing controller of your data. The information you provide above is used to
            send communications about Henima offers, news and events. For more information about the
            processing of your personal data and to know your rights, please consult our{" "}
            <a href="/kebijakan-pengembalian" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
              Privacy Policy
            </a>
            .
          </p>

          {status === "error" && (
            <p style={{ fontSize: 11, color: "rgba(255,140,140,0.8)", marginTop: 8 }}>Try again.</p>
          )}
        </>
      )}
    </div>
  );
}
