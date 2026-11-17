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
  /** Kenzo PDP: white stage + contain, no retail thumbs */
  kenzoFit?: boolean;
}) {
  const fit = kenzoFit ? "contain" : "cover";
  const stageBg = kenzoFit ? "#FFFFFF" : "#F5F5F4";
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);

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
      >
        <span
          style={{
            fontFamily: "var(--font-futura-nav), Futura, sans-serif",
            fontSize: "clamp(28px,5vw,48px)",
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(33,37,41,0.12)",
          }}
        >
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

  /* ===== Kenzo: single white product stage ===== */
  if (kenzoFit) {
    return (
      <div
        className="kz-gallery"
        style={{
          position: "relative",
          background: "#FFFFFF",
          minHeight: "min(100svh, 820px)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
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
            position: "relative",
            width: "100%",
            maxWidth: 560,
            aspectRatio: "1 / 1",
            margin: "0 auto",
            transform: dragging ? `translateX(${dragX * 0.2}px)` : undefined,
            transition: dragging ? "none" : "opacity 0.35s ease",
          }}
        >
          {safeMedia.map((item, i) => (
            <div
              key={`${item.type}-${item.url}-${i}`}
              style={{
                position: "absolute",
                inset: 0,
                opacity: i === active ? 1 : 0,
                pointerEvents: i === active ? "auto" : "none",
                transition: "opacity 0.4s ease",
              }}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  autoPlay={i === active}
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <GalleryImage src={item.url} alt={`${productName} ${i + 1}`} priority={i === 0} fit="contain" />
              )}
            </div>
          ))}
        </div>

        {comingSoon && (
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              background: "#212529",
              color: "#FFFFFF",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "8px 14px",
            }}
          >
            Coming Soon
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="kz-gallery-nav kz-gallery-nav--prev"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="kz-gallery-nav kz-gallery-nav--next"
            >
              ›
            </button>
          </>
        )}

        <style>{`
          .kz-gallery-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            width: 40px;
            height: 40px;
            border: none;
            background: transparent;
            color: #212529;
            cursor: pointer;
            font-size: 28px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.45;
          }
          .kz-gallery-nav:hover { opacity: 1; }
          .kz-gallery-nav--prev { left: 8px; }
          .kz-gallery-nav--next { right: 8px; }
          @media (max-width: 900px) {
            .kz-gallery { min-height: 72vw !important; max-height: none; }
          }
        `}</style>
      </div>
    );
  }

  /* ===== Default (non-Kenzo) gallery ===== */
  return (
    <div
      className="product-gallery"
      style={{
        position: "sticky",
        top: 0,
        height: "100svh",
        background: stageBg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
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
                background: "#111111",
              }}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  autoPlay={i === active}
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: fit, background: "#111", pointerEvents: "none" }}
                />
              ) : (
                <GalleryImage src={item.url} alt={`${productName} ${i + 1}`} priority={i === 0} fit={fit} />
              )}
            </div>
          ))}
        </div>

        {comingSoon && (
          <div style={{ position: "absolute", top: 24, left: 24, background: "#212529", color: "#fff", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 14px", zIndex: 2 }}>
            Coming Soon
          </div>
        )}

        {total > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => go(-1)} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", background: "rgba(17,17,17,0.25)", color: "#fff", cursor: "pointer", fontSize: 22 }}>
              ‹
            </button>
            <button type="button" aria-label="Next image" onClick={() => go(1)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", background: "rgba(17,17,17,0.25)", color: "#fff", cursor: "pointer", fontSize: 22 }}>
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
