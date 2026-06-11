"use client";
import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initial: Record<string, React.CSSProperties> = {
    up: { opacity: 0, transform: "translateY(48px)" },
    left: { opacity: 0, transform: "translateX(-48px)" },
    right: { opacity: 0, transform: "translateX(48px)" },
    fade: { opacity: 0, transform: "none" },
    scale: { opacity: 0, transform: "scale(0.94)" },
  };

  return (
    <div
      ref={ref}
      style={{
        ...(visible ? {} : initial[direction]),
        transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: delay + "ms",
      }}
    >
      {children}
    </div>
  );
}
