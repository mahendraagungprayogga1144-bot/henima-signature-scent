"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { isValidMediaUrl, type GalleryMedia } from "@/lib/product-media";

export type { GalleryMedia };

function GalleryImage({
  src,
  alt,
  priority,
  fit = "cover",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  if (!isValidMediaUrl(src)) return null;

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: fit, objectPosition: "center" }}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: "center", display: "block" }}
    />
  );
}

export default function ProductGallery({
  media,
  productName,
  comingSoon,
  kenzoFit = false,
}: {
  media: GalleryMedia[];
  productName: string;
  comingSoon?: boolean;
  /** Kenzo PDP: light grey + object-fit contain (sm=fit) */
  kenzoFit?: boolean;
}) {
  const fit = kenzoFit ? "contain" : "cover";
  const stageBg = kenzoFit ? "#F5F5F5" : "#F5F5F4";
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const safeMedia = Array.isArray(media) ? media.filter((m) => m && isValidMediaUrl(m.url)) : [];
  const total = safeMedia.length;

  const go = useCallback(
    (dir: number) => {
      if (total <= 1) return;
      setActive((a) => (a + dir + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (total === 0) {
    return (
      <div
        style={{
          background: stageBg,
          minHeight: kenzoFit ? "70svh" : "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: kenzoFit ? "relative" : "sticky",
          top: 0,
        }}
        className="product-gallery"
      >
        <span style={{ fontFamily: "var(--font-futura-nav), Futura, sans-serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(33,37,41,0.12)" }}>
          {productName}
        </span>
      </div>
    );
  }

  function onPointerDown(clientX: number) {
    startX.current = clientX;
    setDragging(true);
    setDragX(0);
  }
  function onPointerMove(clientX: number) {
    if (!dragging) return;
    setDragX(clientX - startX.current);
  }
  function onPointerUp(clientX: number) {
    if (!dragging) return;
    const dx = clientX - startX.current;
    setDragging(false);
    setDragX(0);
    if (dx < -56) go(1);
    else if (dx > 56) go(-1);
  }

  return (
    <div
      className="product-gallery"
      style={{
        position: kenzoFit ? "relative" : "sticky",
        top: 0,
        height: kenzoFit ? "auto" : "100svh",
        minHeight: kenzoFit ? "70svh" : undefined,
        background: stageBg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: "relative",
          flex: 1,
          minHeight: kenzoFit ? "min(70svh, 640px)" : undefined,
          overflow: "hidden",
          cursor: total > 1 ? (dragging ? "grabbing" : "grab") : "default",
          touchAction: "pan-y",
          userSelect: "none",
        }}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={() => {
          if (dragging) {
            setDragging(false);
            setDragX(0);
          }
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            width: `${total * 100}%`,
            transform: `translateX(calc(${(-active * 100) / total}% + ${dragging ? dragX : 0}px))`,
            transition: dragging ? "none" : "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        >
          {safeMedia.map((item, i) => (
            <div
              key={`${item.type}-${item.url}-${i}`}
              style={{
                width: `${100 / total}%`,
                height: "100%",
                position: "relative",
                flexShrink: 0,
                background: kenzoFit ? "#F5F5F5" : "#111111",
              }}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  autoPlay={i === active}
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: fit, background: kenzoFit ? "#F5F5F5" : "#111111", pointerEvents: "none" }}
                />
              ) : (
                <GalleryImage src={item.url} alt={`${productName} ${i + 1}`} priority={i === 0} fit={fit} />
              )}
            </div>
          ))}
        </div>

        {comingSoon && (
          <div style={{ position: "absolute", top: "24px", left: "24px", background: "#212529", color: "#FFFFFF", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 14px", zIndex: 2 }}>
            Coming Soon
          </div>
        )}

        {total > 1 && (
          <>
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                zIndex: 2,
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: kenzoFit ? "#212529" : "rgba(255,255,255,0.85)",
                background: kenzoFit ? "rgba(255,255,255,0.85)" : "rgba(17,17,17,0.35)",
                backdropFilter: "blur(10px)",
                padding: "6px 12px",
                fontFamily: "var(--font-futura-nav), Futura, sans-serif",
              }}
            >
              {active + 1} / {total}
            </div>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: kenzoFit ? "1px solid rgba(33,37,41,0.2)" : "1px solid rgba(255,255,255,0.35)",
                background: kenzoFit ? "#FFFFFF" : "rgba(17,17,17,0.25)",
                color: kenzoFit ? "#212529" : "#FFFFFF",
                cursor: "pointer",
                fontSize: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: kenzoFit ? "0 2px 10px rgba(0,0,0,0.08)" : undefined,
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: kenzoFit ? "1px solid rgba(33,37,41,0.2)" : "1px solid rgba(255,255,255,0.35)",
                background: kenzoFit ? "#FFFFFF" : "rgba(17,17,17,0.25)",
                color: kenzoFit ? "#212529" : "#FFFFFF",
                cursor: "pointer",
                fontSize: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: kenzoFit ? "0 2px 10px rgba(0,0,0,0.08)" : undefined,
              }}
            >
              ›
            </button>
            <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 2 }}>
              {safeMedia.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: kenzoFit
                      ? i === active
                        ? "#212529"
                        : "rgba(33,37,41,0.25)"
                      : i === active
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div style={{ display: "flex", gap: "6px", padding: "12px 14px", background: "#FFFFFF", borderTop: "1px solid rgba(17,17,17,0.06)", overflowX: "auto", scrollbarWidth: "none" }} className="gallery-thumbs">
          {safeMedia.map((item, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => setActive(i)}
              style={{
                position: "relative",
                width: "72px",
                height: "90px",
                flexShrink: 0,
                cursor: "pointer",
                border: active === i ? "1px solid #111111" : "1px solid transparent",
                opacity: active === i ? 1 : 0.55,
                padding: 0,
                background: "#F5F5F4",
                overflow: "hidden",
                transition: "opacity 0.25s, border-color 0.25s",
              }}
            >
              {item.type === "video" ? (
                <span style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#737373", background: "#111111" }}>▶</span>
              ) : (
                <GalleryImage src={item.url} alt={`${productName} thumb ${i + 1}`} />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .gallery-thumbs::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .product-gallery {
            position: relative !important;
            height: auto !important;
            min-height: 70svh;
          }
          .product-gallery > div:first-child {
            min-height: 70svh;
          }
        }
      `}</style>
    </div>
  );
}
