"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => (p + 1) % images.length);
      setAnimating(false);
    }, 400);
  }, [animating, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, images.length]);

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#2C2420,#1A1210)"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div style={{position:"absolute", inset:0}}>
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

      {/* Gradient overlay */}
      <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(20,16,12,0.75) 0%, transparent 60%)", zIndex:2}} />

      {/* Caption */}
      <div style={{position:"absolute", bottom:"40px", left:"40px", zIndex:3}}>
        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", marginBottom:"8px"}}>New Arrival</p>
        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"28px", fontWeight:300, fontStyle:"italic", color:"rgba(240,235,227,0.9)"}}>{productName}</p>
      </div>

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
          <button onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
            style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.2)", border:"none", color:"rgba(240,235,227,0.7)", width:"36px", height:"36px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%"}}>
            ‹
          </button>
          <button onClick={() => setCurrent((p) => (p + 1) % images.length)}
            style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.2)", border:"none", color:"rgba(240,235,227,0.7)", width:"36px", height:"36px", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%"}}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
