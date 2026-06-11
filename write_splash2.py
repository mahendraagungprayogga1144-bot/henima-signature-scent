with open("src/components/SplashScreen.tsx", "w") as f:
    f.write('''"use client";
import { useEffect, useState } from "use";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"typing" | "hold" | "exit" | "done">("typing");
  const [displayed, setDisplayed] = useState("");
  const fullText = "HENIMA";

  useEffect(() => {
    const seen = sessionStorage.getItem("henima-splash");
    if (seen) { setPhase("done"); return; }

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setPhase("hold");
        setTimeout(() => setPhase("exit"), 1800);
        setTimeout(() => {
          setPhase("done");
          sessionStorage.setItem("henima-splash", "1");
        }, 3200);
      }
    }, 120);

    return () => clearInterval(typeInterval);
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
      transition: phase === "exit" ? "opacity 1.4s cubic-bezier(0.16,1,0.3,1)" : "none",
      pointerEvents: phase === "exit" ? "none" : "all",
    }}>
      <div style={{ textAlign: "center" }}>
        {/* Brand name typing */}
        <h1 style={{
          fontFamily: "var(--font-jost, sans-serif)",
          fontSize: "clamp(32px, 6vw, 64px)",
          fontWeight: 200,
          letterSpacing: "0.5em",
          color: "#F5F0E8",
          textTransform: "uppercase",
          margin: 0,
          minWidth: "6ch",
          textAlign: "center",
        }}>
          {displayed}
          <span style={{
            display: "inline-block",
            width: "2px",
            height: "0.8em",
            background: "rgba(200,184,154,0.7)",
            marginLeft: "4px",
            verticalAlign: "middle",
            animation: "blink 0.8s step-end infinite",
            opacity: phase === "hold" ? 0 : 1,
            transition: "opacity 0.3s ease",
          }} />
        </h1>

        {/* Tagline fade in setelah typing selesai */}
        <div style={{
          overflow: "hidden",
          maxHeight: phase === "hold" || phase === "exit" ? "40px" : "0px",
          opacity: phase === "hold" || phase === "exit" ? 1 : 0,
          transition: "max-height 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, opacity 0.8s ease 0.2s",
          marginTop: "20px",
        }}>
          <p style={{
            fontFamily: "var(--font-jost, sans-serif)",
            fontSize: "clamp(9px, 1.2vw, 11px)",
            fontWeight: 300,
            letterSpacing: "0.45em",
            color: "rgba(200,184,154,0.5)",
            textTransform: "uppercase",
            margin: 0,
          }}>
            Signature Scent
          </p>
        </div>

        {/* Garis gold */}
        <div style={{
          width: phase === "hold" || phase === "exit" ? "60px" : "0px",
          height: "1px",
          background: "rgba(200,184,154,0.3)",
          margin: "20px auto 0",
          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }} />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
''')
print("Done!")
