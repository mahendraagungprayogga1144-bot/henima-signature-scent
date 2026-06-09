with open("src/components/PhotoCarousel.tsx", "w") as f:
    f.write('''"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function PhotoCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    isDragging.current = false;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    isDragging.current = false;
  };

  return (
    <section style={{ background: "#FAF8F4", borderTop: "1px solid rgba(28,25,23,0.06)" }}>
      <div style={{ padding: "48px 8vw 24px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#9A8F82", fontFamily: "var(--font-jost)" }}>Gallery</p>
      </div>

      <div
        style={{ position: "relative", width: "100%", overflow: "hidden", cursor: "grab", userSelect: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div style={{ display: "flex", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", transform: "translateX(-" + (current * 100) + "%)", willChange: "transform" }}>
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%", position: "relative", height: "80vh", background: "#1C1917", flexShrink: 0 }}>
              <Image src={img} alt={"Gallery " + (i + 1)} fill style={{ objectFit: "cover", objectPosition: "center", pointerEvents: "none" }} draggable={false} />
            </div>
          ))}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", alignItems: "center" }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "28px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? "#FAF8F4" : "rgba(250,248,244,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
            ))}
          </div>
        )}

        {/* Counter */}
        <div style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(28,25,23,0.5)", backdropFilter: "blur(8px)", color: "#FAF8F4", fontSize: "11px", letterSpacing: "2px", padding: "6px 14px", fontFamily: "var(--font-jost)" }}>
          {current + 1} / {images.length}
        </div>
      </div>
    </section>
  );
}
''')
print("Done!")
