with open("src/components/Reveal.tsx", "w") as f:
    f.write('''"use client";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    // Cek apakah elemen sudah di viewport saat load
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.85;
    if (inView) {
      setTimeout(() => setVisible(true), delay);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  if (!mounted) {
    return <div ref={ref}>{children}</div>;
  }

  const initial: Record<string, React.CSSProperties> = {
    up: { opacity: 0, transform: "translateY(60px)" },
    left: { opacity: 0, transform: "translateX(-60px)" },
    right: { opacity: 0, transform: "translateX(60px)" },
    fade: { opacity: 0, transform: "none" },
    scale: { opacity: 0, transform: "scale(0.93)" },
  };

  return (
    <div
      ref={ref}
      style={{
        ...(visible ? { opacity: 1, transform: "none" } : initial[direction]),
        transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
''')
print("Done!")
