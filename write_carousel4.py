with open("src/components/PhotoCarousel.tsx", "w") as f:
    f.write('''"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function PhotoCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const containerWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    containerWidth.current = containerRef.current?.offsetWidth || window.innerWidth;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    const threshold = containerWidth.current * 0.2;
    if (diff < -threshold && current < images.length - 1) next();
    else if (diff > threshold && current > 0) prev();
    setDragOffset(0);
    setIsDragging(false);
  };

  const translateX = -(current * 100) + (dragOffset / (containerWidth.current || window.innerWidth)) * 100;

  return (
    <section style={{ background: "#FAF8F4", borderTop: "1px solid rgba(28,25,23,0.06)" }}>
      <div style={{ padding: "48px 8vw 24px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#9A8F82", fontFamily: "var(--font-jost)" }}>Gallery</p>
      </div>

      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", overflow: "hidden", cursor: isDragging ? "grabbing" : "grab", userSelect: "none", touchAction: "pan-y" }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={(e) => { if (isDragging) handleDragEnd(e.clientX); }}
      >
        <div style={{
          display: "flex",
          transition: isDragging ? "none" : "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: "translateX(" + translateX + "%)",
          willChange: "transform"
        }}>
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%", position: "relative", height: "85vh", background: "#1C1917", flexShrink: 0 }}>
              <Image src={img} alt={"Gallery " + (i + 1)} fill style={{ objectFit: "cover", objectPosition: "center", pointerEvents: "none" }} draggable={false} />
            </div>
          ))}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", alignItems: "center" }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "32px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? "#FAF8F4" : "rgba(250,248,244,0.35)", border: "none", cursor: "pointer", transition: "all 0.4s ease", padding: 0 }} />
            ))}
          </div>
        )}

        {/* Counter */}
        <div style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(28,25,23,0.45)", backdropFilter: "blur(12px)", color: "#FAF8F4", fontSize: "11px", letterSpacing: "2px", padding: "6px 14px", fontFamily: "var(--font-jost)" }}>
          {current + 1} / {images.length}
        </div>
      </div>
    </section>
  );
}
''')
print("Done!")
