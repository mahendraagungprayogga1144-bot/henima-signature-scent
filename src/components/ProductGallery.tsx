"use client";
import Image from "next/image";
import { useState } from "react";

export type GalleryMedia =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

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

  if (media.length === 0) {
    return (
      <div style={{ background: "#F0EBE3", minHeight: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "48px", fontStyle: "italic", color: "rgba(107,90,74,0.2)" }}>{productName}</span>
      </div>
    );
  }

  const current = media[active];

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
          <Image
            src={current.url}
            alt={productName}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        )}
        {comingSoon && (
          <div style={{ position: "absolute", top: "24px", left: "24px", background: "#1C1917", color: "#FAF8F4", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "6px 14px" }}>
            Coming Soon
          </div>
        )}
        {media.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + media.length) % media.length)}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(250,248,244,0.8)", border: "none", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ‹
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % media.length)}
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(250,248,244,0.8)", border: "none", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div style={{ display: "flex", gap: "4px", padding: "8px", background: "#E8E0D4", overflowX: "auto" }}>
          {media.map((item, i) => (
            <div
              key={i}
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
                <Image src={item.url} alt={`${productName} ${i + 1}`} fill style={{ objectFit: "cover" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function buildProductMedia(photos: string[], video?: string): GalleryMedia[] {
  const media: GalleryMedia[] = [];
  if (video) media.push({ type: "video", url: video });
  for (const url of photos) {
    if (url && (!video || url !== video)) media.push({ type: "image", url });
  }
  return media;
}
