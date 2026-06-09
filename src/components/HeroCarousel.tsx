"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, background:"linear-gradient(160deg,#2C2420,#1A1210)", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div style={{position:"absolute", inset:0}}>
      <div ref={emblaRef} style={{width:"100%", height:"100%", overflow:"hidden"}}>
        <div style={{display:"flex", height:"100%", touchAction:"pan-y"}}>
          {images.map((src, i) => (
            <div key={i} style={{flex:"0 0 100%", minWidth:0, position:"relative", height:"100%"}}>
              <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div style={{position:"absolute", bottom:"24px", right:"32px", display:"flex", gap:"8px", zIndex:10}}>
          {images.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} style={{
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
          <button onClick={scrollPrev} style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.85)", width:"44px", height:"44px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"24px", display:"flex", alignItems:"center", justifyContent:"center"}}>‹</button>
          <button onClick={scrollNext} style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.85)", width:"44px", height:"44px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"24px", display:"flex", alignItems:"center", justifyContent:"center"}}>›</button>
        </>
      )}
    </div>
  );
}
