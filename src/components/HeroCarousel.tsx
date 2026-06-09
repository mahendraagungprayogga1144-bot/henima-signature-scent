"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const next = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => (p + 1) % images.length);
      setAnimating(false);
    }, 400);
  }, [animating, images.length]);

  const prev = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => (p - 1 + images.length) % images.length);
      setAnimating(false);
    }, 400);
  }, [animating, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, images.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#2C2420,#1A1210)"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div style={{position:"absolute", inset:0}} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {images.map((src, i) => (
        <div key={src} style={{
          position:"absolute", inset:0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.8s ease",
          zIndex: i === current ? 1 : 0,
        }}>
          <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} style={{opacity:0.9}} />
        </div>
      ))}





      {/* Dots */}
      {images.length > 1 && (
        <div style={{position:"absolute", bottom:"20px", right:"32px", display:"flex", gap:"6px", zIndex:3}}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? "20px" : "6px",
              height:"6px",
              background: i === current ? "rgba(240,235,227,0.9)" : "rgba(240,235,227,0.3)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all 0.3s ease", borderRadius:"3px",
            }} />
          ))}
        </div>
      )}

      {/* Arrow prev/next */}
      {images.length > 1 && (
        <>
          <button onClick={prev}
            style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.2)", border:"none", color:"rgba(240,235,227,0.7)", width:"36px", height:"36px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%"}}>
            ‹
          </button>
          <button onClick={next}
            style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.2)", border:"none", color:"rgba(240,235,227,0.7)", width:"36px", height:"36px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%"}}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
