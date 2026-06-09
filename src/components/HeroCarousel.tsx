"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function HeroCarousel({ images, productName }: { images: string[]; productName?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!images.length) return (
    <div style={{position:"absolute", inset:0, background:"linear-gradient(160deg,#2C2420,#1A1210)", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"100px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
    </div>
  );

  return (
    <div style={{position:"absolute", inset:0, overflow:"hidden"}}>
      {/* Embla viewport */}
      <div ref={emblaRef} style={{width:"100%", height:"100%", overflow:"hidden"}}>
        <div style={{display:"flex", height:"100%"}}>
          {images.map((src, i) => (
            <div key={i} style={{flex:"0 0 100%", minWidth:0, position:"relative", height:"100%"}}>
              <Image src={src} alt={productName || "Henima"} fill className="object-cover object-center" priority={i === 0} draggable={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={scrollPrev} style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.85)", width:"40px", height:"40px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"22px", display:"flex", alignItems:"center", justifyContent:"center"}}>
            ‹
          </button>
          <button onClick={scrollNext} style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.3)", border:"none", color:"rgba(240,235,227,0.85)", width:"40px", height:"40px", borderRadius:"50%", cursor:"pointer", zIndex:10, fontSize:"22px", display:"flex", alignItems:"center", justifyContent:"center"}}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
