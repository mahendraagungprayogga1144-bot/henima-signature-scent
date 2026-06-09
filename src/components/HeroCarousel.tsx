"use client";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % images.length) + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (!isDragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isDragging.current = true;
      }
      if (isDragging.current) {
        e.preventDefault();
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isDragging.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) setCurrent((p) => (p + 1) % images.length);
        else setCurrent((p) => (p - 1 + images.length) % images.length);
      }
      isDragging.current = false;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [images.length]);

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#2C2420,#1A1210)"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div ref={containerRef} style={{position:"absolute", inset:0, userSelect:"none"}}>
      {images.map((src, i) => (
        <div key={src+i} style={{
          position:"absolute", inset:0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.7s ease",
          zIndex: i === current ? 1 : 0,
        }}>
          <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} />
        </div>
      ))}

      {/* Dots */}
      {images.length > 1 && (
        <div style={{position:"absolute", bottom:"24px", right:"32px", display:"flex", gap:"8px", zIndex:3}}>
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? "24px" : "8px",
              height:"8px",
              background: i === current ? "rgba(240,235,227,0.9)" : "rgba(240,235,227,0.3)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all 0.3s ease", borderRadius:"4px",
            }} />
          ))}
        </div>
      )}

      {/* Arrows — desktop only */}
      {images.length > 1 && (
        <>
          <button onClick={prev} style={{position:"absolute", left:"20px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.25)", border:"none", color:"rgba(240,235,227,0.8)", width:"40px", height:"40px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", fontSize:"20px"}}>
            ‹
          </button>
          <button onClick={next} style={{position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.25)", border:"none", color:"rgba(240,235,227,0.8)", width:"40px", height:"40px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", fontSize:"20px"}}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
