"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

export default function HeroCarousel({ images, productName, heroVideo }: { images: string[]; productName?: string; heroVideo?: string }) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizRef = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const goNext = useCallback(() => setCurrent(p => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);

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
        e.stopPropagation();
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

  if (heroVideo) return (
    <video src={heroVideo} autoPlay muted loop playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0}}/>
  );

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, background:"linear-gradient(160deg,#2C2420,#1A1210)", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div ref={containerRef} style={{position:"absolute", inset:0, overflow:"hidden", cursor:"grab"}}>
      {/* Slides container */}
      <div style={{
        display:"flex",
        width: total * 100 + "%",
        height:"100%",
        transform: `translateX(calc(${-current * (100/total)}% + ${dragging ? dragOffset : 0}px))`,
        transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        willChange:"transform",
      }}>
        {images.map((src, i) => (
          <div key={i} style={{width: 100/total + "%", height:"100%", position:"relative", flexShrink:0}}>
            <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} draggable={false} />
          </div>
        ))}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div style={{position:"absolute", bottom:"24px", right:"32px", display:"flex", gap:"8px", zIndex:10}}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? "24px" : "8px", height:"8px",
              background: i === current ? "rgba(240,235,227,0.9)" : "rgba(240,235,227,0.35)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all 0.3s", borderRadius:"4px",
            }} />
          ))}
        </div>
      )}

      {/* Arrows desktop */}
      {total > 1 && (
        <>
          <button onClick={goPrev} style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.25)", border:"none", color:"rgba(240,235,227,0.85)", width:"44px", height:"44px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"24px", display:"flex", alignItems:"center", justifyContent:"center"}}>‹</button>
          <button onClick={goNext} style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.25)", border:"none", color:"rgba(240,235,227,0.85)", width:"44px", height:"44px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"24px", display:"flex", alignItems:"center", justifyContent:"center"}}>›</button>
        </>
      )}
    </div>
  );
}
