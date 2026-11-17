"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("done");

  useEffect(() => {
    if (pathname !== "/") {
      setPhase("done");
      return;
    }

    setPhase("enter");
    const t1 = setTimeout(() => setPhase("hold"), 900);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 1s cubic-bezier(0.16,1,0.3,1)" : "none",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      <div
        style={{
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <Image
          src="/henima-wordmark.jpg"
          alt="Henima"
          width={653}
          height={465}
          priority
          style={{
            width: "min(280px, 62vw)",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
