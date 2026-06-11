"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    // Cek apakah sudah pernah lihat splash
    const seen = sessionStorage.getItem("henima-splash");
    if (seen) { setPhase("done"); return; }

    // Phase: enter (0-1.5s) → hold (1.5-3s) → exit (3-4.5s) → done
    const t1 = setTimeout(() => setPhase("hold"), 1500);
    const t2 = setTimeout(() => setPhase("exit"), 3000);
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("henima-splash", "1");
    }, 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#0A0806",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity: phase === "exit" ? 0 : 1,
      transition: phase === "exit" ? "opacity 1.5s cubic-bezier(0.16,1,0.3,1)" : "none",
      pointerEvents: phase === "exit" ? "none" : "all",
    }}>
      {/* Brand Name */}
      <div style={{
        opacity: phase === "enter" ? 0 : 1,
        transform: phase === "enter" ? "translateY(16px)" : "translateY(0)",
        transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "var(--font-jost, sans-serif)",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 300,
          letterSpacing: "0.35em",
          color: "#F5F0E8",
          textTransform: "uppercase",
          margin: 0,
          lineHeight: 1,
        }}>
          Henima
        </h1>
        <div style={{
          width: "40px",
          height: "1px",
          background: "rgba(200,184,154,0.5)",
          margin: "20px auto",
          opacity: phase === "hold" || phase === "exit" ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }} />
        <p style={{
          fontFamily: "var(--font-jost, sans-serif)",
          fontSize: "clamp(9px, 1.5vw, 11px)",
          fontWeight: 300,
          letterSpacing: "0.4em",
          color: "rgba(200,184,154,0.6)",
          textTransform: "uppercase",
          margin: 0,
          opacity: phase === "hold" || phase === "exit" ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
        }}>
          Signature Scent
        </p>
      </div>
    </div>
  );
}
