"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

export default function HeroCarousel({
  images,
  productName,
  heroVideo,
}: {
  images: string[];
  productName?: string;
  heroVideo?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizRef = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const goNext = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || total <= 1) return;

    function onStart(e: TouchEvent) {
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      isHorizRef.current = null;
      setDragging(true);
      setDragOffset(0);
    }

    function onMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - startXRef.current;
      const dy = e.touches[0].clientY - startYRef.current;
      if (isHorizRef.current === null) {
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isHorizRef.current = Math.abs(dx) > Math.abs(dy);
        }
        return;
      }
      if (isHorizRef.current) {
        e.preventDefault();
        setDragOffset(dx);
      }
    }

    function onEnd(e: TouchEvent) {
      if (!isHorizRef.current) {
        setDragging(false);
        setDragOffset(0);
        return;
      }
      const dx = e.changedTouches[0].clientX - startXRef.current;
      setDragging(false);
      setDragOffset(0);
      if (dx < -60) goNext();
      else if (dx > 60) goPrev();
    }

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [total, goNext, goPrev]);

  if (heroVideo) {
    return (
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
    );
  }

  // Soft sky/water plane — Kenzo lifestyle hero when media not loaded yet
  if (!images.length) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 60% 40%, #c5e4f2 0%, #7eb8d4 35%, #5a9ab8 65%, #3d7a98 100%)",
        }}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", cursor: "grab" }}>
      <div
        style={{
          display: "flex",
          width: total * 100 + "%",
          height: "100%",
          transform: `translateX(calc(${-current * (100 / total)}% + ${dragging ? dragOffset : 0}px))`,
          transition: dragging ? "none" : "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform",
        }}
      >
        {images.map((src, i) => (
          <div key={i} style={{ width: 100 / total + "%", height: "100%", position: "relative", flexShrink: 0 }}>
            {src.startsWith("/") ? (
              <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} draggable={false} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={productName || "Henima"} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
            )}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous"
            style={{ position: "absolute", right: 20, top: "48%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", zIndex: 10, fontSize: 18 }}
          >
            ‹
          </button>
          <button
            onClick={() => {/* pause visual only */}}
            aria-label="Pause"
            style={{ position: "absolute", right: 20, top: "54%", background: "transparent", border: "none", color: "#fff", cursor: "pointer", zIndex: 10, fontSize: 14, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            ❚❚
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            style={{ position: "absolute", right: 20, bottom: 28, background: "rgba(255,255,255,0.85)", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", zIndex: 10, fontSize: 18 }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
