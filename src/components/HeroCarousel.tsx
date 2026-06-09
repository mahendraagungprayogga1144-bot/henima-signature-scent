"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || images.length <= 1) return;

    const onStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isHorizontal.current = null;
    };

    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;

      if (isHorizontal.current === null) {
        if (Math.abs(dx) > Math.abs(dy)) {
          isHorizontal.current = true;
        } else {
          isHorizontal.current = false;
        }
      }

      if (isHorizontal.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (!isHorizontal.current) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      if (dx < -40) setCurrent(p => (p + 1) % images.length);
      else if (dx > 40) setCurrent(p => (p - 1 + images.length) % images.length);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [images.length]);

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, background:"linear-gradient(160deg,#2C2420,#1A1210)", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div ref={containerRef} style={{position:"absolute", inset:0, overflow:"hidden", touchAction:"none"}}>
      {images.map((src, i) => (
        <div key={i} style={{
          position:"absolute", inset:0,
          opacity: i === current ? 1 : 0,
          transition:"opacity 0.7s ease",
          zIndex: i === current ? 1 : 0,
          pointerEvents: i === current ? "auto" : "none",
        }}>
          <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} draggable={false} />
        </div>
      ))}

      {/* Dots */}
      {images.length > 1 && (
        <div style={{position:"absolute", bottom:"24px", right:"32px", display:"flex", gap:"8px", zIndex:10}}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? "24px" : "8px", height:"8px",
              background: i === current ? "rgba(240,235,227,0.9)" : "rgba(240,235,227,0.3)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all 0.3s", borderRadius:"4px",
            }} />
          ))}
        </div>
      )}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)}
            style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.8)", width:"40px", height:"40px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"20px", display:"flex", alignItems:"center", justifyContent:"center"}}>
            ‹
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % images.length)}
            style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.8)", width:"40px", height:"40px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"20px", display:"flex", alignItems:"center", justifyContent:"center"}}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
