"use client";
import { useState } from "react";
import Image from "next/image";

export default function PhotoCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <section style={{ background: "#FAF8F4", padding: "80px 0", borderTop: "1px solid rgba(28,25,23,0.06)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 8vw" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "40px", fontFamily: "var(--font-jost)" }}>
          Gallery
        </p>
      </div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Track */}
        <div style={{ display: "flex", transition: "transform 0.5s ease", transform: "translateX(-" + (current * 100) + "%)" }}>
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%", position: "relative", aspectRatio: "16/7", background: "#F0EBE3" }}>
              <Image src={img} alt={"Gallery " + (i + 1)} fill style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", background: "rgba(28,25,23,0.6)", color: "#FAF8F4", border: "none", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ‹
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", background: "rgba(28,25,23,0.6)", color: "#FAF8F4", border: "none", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ›
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? "#FAF8F4" : "rgba(250,248,244,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
