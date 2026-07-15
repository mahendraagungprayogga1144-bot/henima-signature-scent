"use client";
import Image from "next/image";
import { useState } from "react";
import { isValidMediaUrl, type GalleryMedia } from "@/lib/product-media";

export type { GalleryMedia };

function GalleryImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  if (!isValidMediaUrl(src)) return null;

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority={priority}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
    />
  );
}

export default function ProductGallery({
  media,
  productName,
  comingSoon,
}: {
  media: GalleryMedia[];
  productName: string;
  comingSoon?: boolean;
}) {
  const [active, setActive] = useState(0);
  const safeMedia = Array.isArray(media) ? media.filter((m) => m && isValidMediaUrl(m.url)) : [];
  const current = safeMedia[Math.min(active, Math.max(safeMedia.length - 1, 0))];

  if (safeMedia.length === 0 || !current) {
    return (
      <div style={{ background: "#F0EBE3", minHeight: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "48px", fontStyle: "italic", color: "rgba(107,90,74,0.2)" }}>{productName}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#F0EBE3" }} className="product-gallery">
      <div style={{ position: "relative", flex: 1, minHeight: "500px", overflow: "hidden" }}>
        {current.type === "video" ? (
          <video
            src={current.url}
            controls
            playsInline
            muted
            loop
            style={{ width: "100%", height: "100%", objectFit: "cover", background: "#1C1917" }}
          />
        ) : (
          <GalleryImage src={current.url} alt={productName} priority />
        )}
        {comingSoon && (
          <div style={{ position: "absolute", top: "24px", left: "24px", background: "#1C1917", color: "#FAF8F4", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "6px 14px" }}>
            Coming Soon
          </div>
        )}
        {safeMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((a) => (a - 1 + safeMedia.length) % safeMedia.length)}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(250,248,244,0.8)", border: "none", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % safeMedia.length)}
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(250,248,244,0.8)", border: "none", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeMedia.length > 1 && (
        <div style={{ display: "flex", gap: "4px", padding: "8px", background: "#E8E0D4", overflowX: "auto" }}>
          {safeMedia.map((item, i) => (
            <div
              key={`${item.type}-${item.url}-${i}`}
              onClick={() => setActive(i)}
              style={{
                position: "relative",
                width: "64px",
                height: "64px",
                flexShrink: 0,
                cursor: "pointer",
                opacity: active === i ? 1 : 0.5,
                border: active === i ? "2px solid #1C1917" : "2px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
                background: item.type === "video" ? "#1C1917" : undefined,
              }}
            >
              {item.type === "video" ? (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8B89A", fontSize: "18px" }}>▶</div>
              ) : (
                <GalleryImage src={item.url} alt={`${productName} ${i + 1}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
